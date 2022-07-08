import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';
import { signOut } from 'next-auth/react';
import { TwitterEndpoints } from '../../../modules/twitterapi/endpoints';
import { ApiError } from '../../../modules/twitterapi/types/errors';
import Timeline, { Meta } from '../../../modules/twitterapi/types/timeline';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { query: { query, tags, q, max_results, exclude }, method } = req;
	const secret = process.env.NEXTAUTH_SECRET;
	const token = await getToken({ req, secret });

	if (method !== 'GET') {
		res.setHeader('Allow', ['GET']);
		return res.status(405).end(`Method ${method} Not Allowed`);
	}

	if (!token) {
		return res.status(401).json({
			errors: [
				{ message: 'no valid session' },
			],
		})
	}

	const galleryQuery =
		'expansions=attachments.media_keys,author_id' +
		//'&user.fields=id,name,username' + //this is included with author_id expansion by default
		'&tweet.fields=possibly_sensitive,public_metrics' + //includes [id, text]
		'&media.fields=preview_image_url,url,width,height' + //includes [media_key, type]
	(exclude ? `&exclude=${exclude}` : '') + //should make this optional
	`&max_results=${max_results || 10}`;
	// (params?.token ? `&pagination_token=${params?.token}` : '') +
	// (params?.newest_id ? `&since_id=${params?.newest_id}` : '') +
	// (params?.oldest_id ? `&until_id=${params?.oldest_id}` : '');

	let apiRes: Response | undefined = undefined;

	const me = (query && query[0] === 'me');
	const search = (query && query[0] === 'search');
	const user = (query && query[0] === 'user');

	console.log('me: ', me);
	console.log('tags: ', tags);
	console.log('search: ', q);
	console.log('user: ', user);

	if (me) {
		apiRes = await TwitterEndpoints.getMyFeed(token.sub!, token.accessToken!, galleryQuery);
	}
	else if (user) {
		apiRes = await TwitterEndpoints.getUsersTweets(query[1], token.accessToken!, galleryQuery);
	}
	else if (tags || search) {
		let searchTerm = '';
		if (search && q) searchTerm += (q as string).replaceAll(',', ' ') + ' ';
		if (tags) searchTerm += '#' + (tags as string).replaceAll(',', ' #');
		searchTerm = searchTerm.trim();
		console.log(searchTerm);
		console.log(encodeURIComponent(searchTerm));
		apiRes = await TwitterEndpoints.getRecentTweets(encodeURIComponent(searchTerm), token.accessToken!, galleryQuery);
	}

	if (apiRes) {
		if (apiRes.status != 200) {
			if(apiRes.status === 401) await signOut();
			
			let apiError: ApiError = await apiRes.json();
			return res.status(apiRes.status).json(apiError);
		}

		const timeline = (await apiRes.json()) as Timeline;
		let response: {
			meta?: Meta,
			items: {
				key: string;
				tweet_id: string;
				author_id: string;
				type: string;
				url: string;
				width: number;
				height: number;
				nsfw?: boolean;
				metrics: {
					retweets: number;
					replies: number;
					likes: number;
					quotes: number;
				}
			}[],
			authors: {
				id: string;
				username: string;
				name: string;
			}[]
		} | undefined = undefined;

		if (timeline.data && timeline.includes?.media) {
			response = { meta: timeline.meta, items: [], authors: [] };

			timeline.includes.users?.forEach(author => {
				response?.authors.push(author);
			})

			timeline.includes.media.forEach(item => {
				//look up tweet by matching media key (deep search as tweets can have up to 4 images)
				const tweet = timeline.data?.find(tweet => tweet.attachments?.media_keys?.find(k => k === item.media_key));

				if (tweet) {
					response?.items.push({
						key: item.media_key,
						tweet_id: tweet.id,
						author_id: tweet.author_id,
						type: item.type,
						url: item.preview_image_url || item.url,
						width: item.width,
						height: item.height,
						nsfw: tweet.possibly_sensitive ? true : undefined,
						metrics: {
							replies: tweet.public_metrics?.reply_count || 0,
							likes: tweet.public_metrics?.like_count || 0,
							retweets: tweet.public_metrics?.retweet_count || 0,
							quotes: tweet.public_metrics?.quote_count || 0,
						}
					})
				}

			})
		}

		res.status(apiRes.status).send(JSON.stringify(response, null, 4));
	} else {
		res.status(400).end('no appropriate endpoint');
	}
}