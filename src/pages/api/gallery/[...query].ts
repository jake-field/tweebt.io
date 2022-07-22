import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';
import Gallery from '../../../modules/gallery/types/gallery';
import { TwitterEndpoints } from '../../../modules/twitterapi/endpoints';
import { ApiError } from '../../../modules/twitterapi/types/errors';
import Timeline from '../../../modules/twitterapi/types/timeline';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { query: { query, tags, q, max_results, exclude, next }, method } = req;
	const secret = process.env.NEXTAUTH_SECRET;
	const token = await getToken({ req, secret });
	const apitoken = process.env.TWITTER_API_TOKEN;

	//only allow GET requests at this endpoint
	if (method !== 'GET') {
		res.setHeader('Allow', ['GET']);
		return res.status(405).end(`Method ${method} Not Allowed`);
	}

	//build standard query for the app
	const galleryQuery =
		'expansions=attachments.media_keys,author_id,referenced_tweets.id,referenced_tweets.id.author_id' +
		//'&user.fields=id,name,username' + //this is included with author_id expansion by default
		'&tweet.fields=possibly_sensitive,public_metrics,referenced_tweets' + //includes [id, text]
		'&media.fields=preview_image_url,url,width,height,alt_text' + //includes [media_key, type]
		(exclude ? `&exclude=${exclude}` : '') + //should make this optional
		(next ? `&pagination_token=${next}` : '') + //should make this optional
		`&max_results=${max_results || 10}`;
	// (params?.token ? `&pagination_token=${params?.token}` : '') +
	// (params?.newest_id ? `&since_id=${params?.newest_id}` : '') +
	// (params?.oldest_id ? `&until_id=${params?.oldest_id}` : '');

	let apiRes: Response | undefined = undefined;

	const me = (query && query[0] === 'me');
	const search = (query && query[0] === 'search');
	const user = (query && query[0] === 'user');

	console.log(query);
	console.log('me: ', me);
	console.log('tags: ', tags);
	console.log('search: ', q);
	console.log('user: ', user);

	if (me) {
		if (!token) {
			return res.status(401).json({
				errors: [
					{ message: 'no valid session' },
				],
			})
		}

		apiRes = await TwitterEndpoints.getMyFeed(token.sub!, token.accessToken!, galleryQuery);
	}
	else if (user) {
		apiRes = await TwitterEndpoints.getUsersTweets(query[1], token?.accessToken || apitoken, galleryQuery);
	}
	else if (tags || search) {
		let searchTerm = '-is:retweet -is:quote -is:reply has:media '; //filter by original post only, only tweets with media
		if (search && q) searchTerm += (q as string).replaceAll(',', ' ') + ' ';
		if (tags) searchTerm += '#' + (tags as string).replaceAll(',', ' #');
		searchTerm = searchTerm.trim();
		console.log(searchTerm);
		console.log(encodeURIComponent(searchTerm));
		apiRes = await TwitterEndpoints.getRecentTweets(encodeURIComponent(searchTerm), token?.accessToken || apitoken, galleryQuery);
	}

	if (apiRes) {
		if (apiRes.status != 200) {
			console.log('not 200 repsonse');
			if (apiRes.status === 401) console.log('token invalidated, unauthorized')

			let apiError: ApiError = await apiRes.json();
			return res.status(apiRes.status).json(apiError);
		}

		const timeline = (await apiRes.json()) as Timeline;
		console.log('timeline errors: ', timeline.errors);

		const response = new Gallery(timeline);
		return res.status(apiRes.status).json(response);
	} else {
		return res.status(400).end('no appropriate endpoint');
	}
}