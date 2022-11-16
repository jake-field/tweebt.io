import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';
import Gallery from '../../modules/gallery/types/gallery';
import { TwitterEndpoints } from '../../modules/twitterapi';
import { BaseTweetParams, SearchParams, TimelineParams } from '../../modules/twitterapi/types/params';
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
	const baseParams: BaseTweetParams = {
		expansions: ['attachments.media_keys', 'author_id', 'referenced_tweets.id', 'referenced_tweets.id.author_id'],
		'user.fields': ['profile_image_url', 'protected'], //protected to help against the broken retweet image issue
		'tweet.fields': ['possibly_sensitive', 'public_metrics', 'referenced_tweets', 'created_at'],
		'media.fields': ['preview_image_url', 'url', 'width', 'height', 'alt_text', 'duration_ms', 'public_metrics', 'variants'],
		max_results: Number(max_results) || 10,
	};

	//Endpoint actions
	//Attempting to use token over apitoken to reduce overall count against my quota
	//TODO: in the event of a 401 unauth on search or user, invalidate user but still return valid results
	let apiRes: Response | undefined = undefined;
	if (isFeedAction || isUserAction) {
		const params: TimelineParams = baseParams;
		if (exclude) params.exclude = Array.isArray(exclude) ? exclude as any : [exclude as string];
		if (next) params.pagination_token = next as string;

		if (isFeedAction) apiRes = await TwitterEndpoints.getMyFeed(clientToken?.sub!, clientToken?.accessToken!, params);
		else if (userActionRequest) apiRes = await TwitterEndpoints.getUsersTweets(userActionRequest, clientToken?.accessToken || appToken, params);
	}
	else if (isSearchAction && (q && q.length > 0)) {
		const params: SearchParams = {
			...baseParams,
			query: `${(q as string).replaceAll(',', ' ')}${!exclude?.includes('retweets') ? '' : ' -is:retweet -is:quote'}${!exclude?.includes('replies') ? '' : ' -is:reply'} has:media`
		};

		if (next) params.next_token = next as string;
		params.query = params.query.replaceAll(' ', '%20');

		apiRes = await TwitterEndpoints.getSearchResults(clientToken?.accessToken || appToken, params)
	}

	//Handle response, they're all the same regardless
	if (apiRes) {
		return res.status(apiRes.status).json(apiRes.status === 200 ? new Gallery((await apiRes.json()) as Timeline) : await apiRes.json());
	} else {
		return res.status(400).end('Invalid request');
	}
}