import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';
import Gallery from '../../modules/gallery/types/gallery';
import { TwitterEndpoints } from '../../modules/twitterapi';
import Timeline from '../../modules/twitterapi/types/timeline';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { query: { query, q, max_results, exclude, next }, method } = req;
	const authSecret = process.env.NEXTAUTH_SECRET;
	const appToken = process.env.TWITTER_API_TOKEN;
	const clientToken = await getToken({ req, secret: authSecret });

	//only allow GET requests
	if (method !== 'GET') {
		res.setHeader('Allow', ['GET']);
		return res.status(405).end(`Method ${method} Not Allowed`);
	}

	//Check for invalid query (This should be hard to reach)
	if (!query?.at(0)) return res.status(400).end('No query provided');

	//action
	const action = query.at(0);
	const isFeedAction = (action === 'feed');
	const isSearchAction = (action === 'search');
	const isUserAction = (action === 'user');
	const userActionRequest = query.at(1);

	//Check for token validity if user feed is requested
	if (isFeedAction && (!clientToken || !clientToken.sub || !clientToken.accessToken)) return res.status(401).end('Unauthorized, cannot get feed for invalid session.');

	//build standard query params for the app
	const params =
		'expansions=attachments.media_keys,author_id,referenced_tweets.id,referenced_tweets.id.author_id' +
		'&user.fields=profile_image_url' +
		'&tweet.fields=possibly_sensitive,public_metrics,referenced_tweets,created_at' + //includes [id, text]
		'&media.fields=preview_image_url,url,width,height,alt_text,duration_ms,public_metrics,variants' + //includes [media_key, type]
		(exclude && !isSearchAction ? `&exclude=${exclude}` : '') + //cannot be included if this is a search, excludes are done in the query (-is:retweet etc)
		(next ? `&pagination_token=${next}` : '') +
		`&max_results=${max_results || 10}`;

	//Endpoint actions
	//Attempting to use token over apitoken to reduce overall count against my quota
	//TODO: in the event of a 401 unauth on search or user, invalidate user but still return valid results
	let apiRes: Response | undefined = undefined;
	let sessionExpired: boolean = false;
	if (isFeedAction) {
		apiRes = await TwitterEndpoints.getMyFeed(clientToken?.sub!, clientToken?.accessToken!, params); //token.sub is the user ID associated with the handle of the logged in user
	} else if (isSearchAction && (q && q.length > 0)) {
		let searchTerm = `${(q as string).replaceAll(',', ' ')} ${!exclude?.includes('retweets') ? '' : '-is:retweet -is:quote'} ${!exclude?.includes('replies') ? '' : '-is:reply'} has:media`;
		apiRes = await TwitterEndpoints.getRecentTweets(encodeURIComponent(searchTerm.replaceAll(/ +/gi, ' ')), clientToken?.accessToken || appToken, params);

		//if we have an access token and get 401, try again with the app token only
		if (clientToken?.accessToken && apiRes.status === 401) {
			apiRes = await TwitterEndpoints.getRecentTweets(encodeURIComponent(searchTerm.replaceAll(/ +/gi, ' ')), appToken, params);
			sessionExpired = apiRes.status === 200; //If we get 200 here, it means that the session expired
		}
	} else if (isUserAction && userActionRequest) {
		apiRes = await TwitterEndpoints.getUsersTweets(userActionRequest, clientToken?.accessToken || appToken, params); //doesn't matter if no token

		//if we have an access token and get 401, try again with the app tokenonly
		if (clientToken?.accessToken && apiRes.status === 401) {
			apiRes = await TwitterEndpoints.getUsersTweets(userActionRequest, appToken, params);
			sessionExpired = apiRes.status === 200; //If we get 200 here, it means that the session expired
		}
	}

	//Handle response, they're all the same regardless
	if (apiRes) {
		if (apiRes.status === 200) {
			const gallery = new Gallery((await apiRes.json()) as Timeline);
			return res.status(sessionExpired ? 401 : apiRes.status).json(gallery);//end(JSON.stringify(gallery, undefined, 2));//
		}
		else {
			return res.status(apiRes.status).json(await apiRes.json());
		}
	} else {
		return res.status(400).end('Invalid request');
	}
}