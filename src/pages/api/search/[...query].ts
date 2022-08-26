import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';
import Gallery from '../../../modules/gallery/types/gallery';
import { TwitterEndpoints } from '../../../modules/twitterapi/endpoints';
import { ApiError } from '../../../modules/twitterapi/types/errors';
import Timeline from '../../../modules/twitterapi/types/timeline';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { query: { query, max_results, exclude, next }, method } = req;
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
		'&user.fields=profile_image_url' +
		'&tweet.fields=possibly_sensitive,public_metrics,referenced_tweets' + //includes [id, text]
		'&media.fields=preview_image_url,url,width,height,alt_text' + //includes [media_key, type]
		(exclude ? `&exclude=${exclude}` : '') +
		(next ? `&pagination_token=${next}` : '') +
		`&max_results=${max_results || 10}`;
	// (params?.newest_id ? `&since_id=${params?.newest_id}` : '') +
	// (params?.oldest_id ? `&until_id=${params?.oldest_id}` : '');

	let apiRes: Response | undefined = undefined;
	const q = (query as string[]).join(' ');
	
	if (q && q.length > 0) {
		let searchTerm = `${(q as string).replaceAll(',', ' ')} ${exclude?.includes('retweet') ? '' : '-is:retweet -is:quote'} ${exclude?.includes('replies') ? '' : '-is:reply'} has:media`; //filter by original post only, only tweets with media
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
		const response = new Gallery(timeline);
		return res.status(apiRes.status).json(response);
	} else {
		return res.status(400).end('no appropriate endpoint');
	}
}