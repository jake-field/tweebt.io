import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';
import Gallery from '../../../modules/shared/types/gallery';
import { TwitterEndpoints } from '../../../modules/twitterapi/endpoints';
import { ApiError } from '../../../modules/twitterapi/types/errors';
import Timeline from '../../../modules/twitterapi/types/timeline';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { query: { query, tags, q, max_results, exclude, next }, method } = req;
	const secret = process.env.NEXTAUTH_SECRET;
	const token = await getToken({ req, secret });

	if (method !== 'GET') {
		res.setHeader('Allow', ['GET']);
		return res.status(405).end(`Method ${method} Not Allowed`);
	}

	//TODO: this blocks non-logged in requests, need to change the code in this file
	//		to use the API token instead of user token if accessing a public endpoint
	if (!token) {
		return res.status(401).json({
			errors: [
				{ message: 'no valid session' },
			],
		})
	}

	const galleryQuery =
		'expansions=attachments.media_keys,author_id,referenced_tweets.id,referenced_tweets.id.author_id' +
		//'&user.fields=id,name,username' + //this is included with author_id expansion by default
		'&tweet.fields=possibly_sensitive,public_metrics,referenced_tweets' + //includes [id, text]
		'&media.fields=preview_image_url,url,width,height' + //includes [media_key, type]
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
		apiRes = await TwitterEndpoints.getMyFeed(token.sub!, token.accessToken!, galleryQuery);
	}
	else if (user) {
		apiRes = await TwitterEndpoints.getUsersTweets(query[1], token.accessToken!, galleryQuery);
	}
	else if (tags || search) {
		let searchTerm = '-is:retweet -is:quote -is:reply has:media '; //filter by original post only, only tweets with media
		if (search && q) searchTerm += (q as string).replaceAll(',', ' ') + ' ';
		if (tags) searchTerm += '#' + (tags as string).replaceAll(',', ' #');
		searchTerm = searchTerm.trim();
		console.log(searchTerm);
		console.log(encodeURIComponent(searchTerm));
		apiRes = await TwitterEndpoints.getRecentTweets(encodeURIComponent(searchTerm), token.accessToken!, galleryQuery);
	}

	if (apiRes) {
		if (apiRes.status != 200) {
			console.log('not 200 repsonse');
			if (apiRes.status === 401) console.log('token invalidated, unauthorized')

			let apiError: ApiError = await apiRes.json();
			return res.status(apiRes.status).json(apiError);
		}

		const timeline = (await apiRes.json()) as Timeline;
		let response: Gallery | undefined = undefined;

		if (timeline.data && timeline.includes?.media) {
			response = { meta: timeline.meta, items: [] };

			timeline.includes.media.forEach(item => {
				//look up tweet by matching media key (deep search as tweets can have up to 4 images)
				const tweet = timeline.data?.find(tweet => tweet.attachments?.media_keys?.find(k => k === item.media_key));

				if (tweet) {
					//find tweet author
					const author = timeline.includes?.users?.find(user => user.id === tweet?.author_id);

					//build the referencing object, taking the reference tweet and username (not id) of the tweet author
					//this is mainly done to fix public-metrics as only retweets and tweetID are passed, not user or likes/replies
					const referencing = tweet?.referenced_tweets ? tweet?.referenced_tweets.map(ref => {
						const refTweet = timeline.includes?.tweets?.find(t => t.id === ref.id);
						const user = refTweet ? timeline.includes?.users?.find(u => u.id === refTweet?.author_id) : undefined;
						return {
							type: ref.type,
							id: ref.id,
							username: user?.username || ''
						}
					}) : undefined;

					//get the correct metrics, if we're dealing with an original tweet, metrics are accurate
					//	if we are dealing with a retweet, only the retweets are stored in the tweet variable
					//	however, the accurate metrics are held under includes.tweets
					let metricsTweet = referencing ? timeline.includes?.tweets?.find(t => t.id === referencing[0].id) || tweet : tweet;
					let correctMetrics = {
						replies: metricsTweet.public_metrics?.reply_count || 0,
						likes: metricsTweet.public_metrics?.like_count || 0,
						retweets: metricsTweet.public_metrics?.retweet_count || 0,
						quotes: metricsTweet.public_metrics?.quote_count || 0,
					};

					//prep tweet text by stripping the RT information and the "twitter quick link" at the end of every tweet from the api
					const tweetText = tweet.text.replaceAll(/(^RT @[a-z0-9_]*: )|(https:\/\/t.co\/\w*$)/gim, '');

					//push to the response items array
					response?.items.push({
						key: item.media_key,
						tweet_id: tweet.id,
						author: {
							id: author?.id || '',
							username: author?.username || 'unknown',
							name: author?.name || 'unknown',
						},
						referencing: referencing,
						text: tweetText,
						type: item.type,
						url: item.preview_image_url || item.url,
						width: item.width,
						height: item.height,
						nsfw: tweet.possibly_sensitive ? true : undefined,
						metrics: correctMetrics
					})
				}
			})
		}

		res.status(apiRes.status).json(response);
	} else {
		res.status(400).end('no appropriate endpoint');
	}
}