import { formatTimeAgo, shortenTimeAgo } from '../../../common/utils/formatnumber';
import proxyMediaURL from '../../../common/utils/proxymediaurl';
import { fixCarets } from '../../../common/utils/regextests';
import Timeline, { Meta } from '../../twitterapi/types/timeline';
import { Error, Media, Tweet } from './gallery.types';

export default class Gallery {
	meta: Meta;
	items: Media[];
	error?: Error;

	//Constructor from Timeline
	constructor(timeline: Timeline) {
		this.meta = timeline.meta || { result_count: 0 };
		this.error = timeline.meta ? undefined : { title: 'Error', detail: 'No metadata' };
		this.items = [];

		if (timeline.meta === undefined && timeline.errors !== undefined) {
			const leadingError = timeline.errors?.at(0);

			if (leadingError !== undefined) {
				if (leadingError.title.match(/auth/gi)) this.error = { title: 'Unable to view account', detail: 'Account is inacessible\n(Deleted/Suspended/Protected)' };
			} else {
				this.error = { title: 'Unknown Error', detail: 'Timeline error' };
				console.log('Unhandled timeline error with missing metadata\n', timeline.errors);
			}
		}

		//check that the timeline has tweets (data)
		if (timeline.data) {
			//for each media item
			timeline.includes?.media?.forEach(item => {
				//look up tweet by matching media key
				const tweet = timeline.data?.find(t => t.attachments?.media_keys?.includes(item.media_key));

				//if we found a matching tweet (this should always be true)
				if (tweet) {
					//find tweet author
					const author = timeline.includes?.users?.find(u => u.id === tweet.author_id);

					//If user uses the null character as their twitter name, replace it with their handle for the sake of UI/UX
					if (author && encodeURI(author.name) === '%EF%B8%8F') author.name = author.username;

					//build the referencing object, taking the reference tweet and username (not id) of the tweet author
					//this is mainly done to fix public-metrics as only retweets and tweetID are passed, not user or likes/replies
					let ref: Tweet | undefined = undefined;
					let metricsTweet = tweet;

					//if there are referenced tweets
					if (tweet.referenced_tweets) {
						//If refTweet cannot be found, then the Tweet is deleted or inacessible. (deleted, suspended/protected)
						const refDesc = tweet.referenced_tweets[0];
						const refTweet = timeline.includes?.tweets?.find(t => t.id === refDesc.id);
						const refAuthor = refTweet ? timeline.includes?.users?.find(u => u.id === refTweet?.author_id) : undefined;

						//force metrics to use this tweet if it's a retweet (gets original tweet numbers)
						if (refTweet && refDesc.type === 'retweeted') metricsTweet = refTweet;

						ref = {
							//Use this tweet id if the original is deleted/protected, this allows us to still show the reference in some form
							id: refTweet?.id || tweet.id,
							type: refDesc.type,
							created_at: formatTimeAgo(refTweet?.created_at || tweet.created_at),

							author: {
								id: refAuthor?.id || author?.id || '',

								//Sometimes user won't be valid due to a protected/deleted tweet
								//In this case, try match the username from the tweet text
								//	or use the author username as Twitter has a special redirect for threads
								name: refAuthor?.name || '[Deleted Tweet]',
								handle: refAuthor?.username || tweet.text.match(/^(?:@)(\w*)/i)?.at(1) || author?.username || '',

								//try for their profile image, but if the tweet was deleted/protected this may be null, so use default profile image
								image: proxyMediaURL(refAuthor?.profile_image_url) || '/media/user_normal.png',
							},
						};

						ref.created_at_short = shortenTimeAgo(ref.created_at);
					}

					//prep tweet text by stripping the RT information and the 'twitter quick link' at the end of every tweet from the api
					//don't strip the leading @ if we are referencing someone as there is no twitter prepended @
					let tweetText = fixCarets(tweet.text);
					if (ref) tweetText = tweetText.replace(/(^(RT )?@[a-z0-9_]*:? )|( ?https:\/\/t.co\/\w* ?)*$/gim, '');
					else tweetText = tweetText.replace(/( ?https:\/\/t.co\/\w* ?)*$/gim, '');

					//if video, get highest quality
					let bitrate = -1;
					let lqbitrate = 999999999999999;
					let videoURL: string | undefined = undefined;
					let videolqURL: string | undefined = undefined;
					if (item.type === 'video') {
						item.variants?.forEach(variant => {
							if (variant.bit_rate && variant.bit_rate >= bitrate) {
								bitrate = variant.bit_rate;
								videoURL = variant.url;
							}

							if (variant.bit_rate && variant.bit_rate <= lqbitrate) {
								lqbitrate = variant.bit_rate;
								videolqURL = variant.url;
							}
						});
					} else {
						videoURL = item.variants?.find(v => v.url.includes('mp4'))?.url;
					}

					//remove ?tag=12 etc. from them
					if (videoURL) videoURL = videoURL?.replace(/\?tag=.*/i, '');
					if (videolqURL) videolqURL = (videolqURL as string)?.replace(/\?tag=.*/i, ''); //no idea why this throws an error without (* as string)

					//only one available
					if (videolqURL === videoURL) videolqURL = undefined;

					//push to the response items array
					this.items.push({
						id: item.media_key,
						type: item.type,

						tweet: {
							id: tweet.id,
							text: tweetText,
							created_at: formatTimeAgo(tweet.created_at),
							created_at_short: shortenTimeAgo(formatTimeAgo(tweet.created_at)),
							metrics: {
								replies: metricsTweet.public_metrics?.reply_count || 0,
								likes: metricsTweet.public_metrics?.like_count || 0,
								retweets: metricsTweet.public_metrics?.retweet_count || 0,
								quotes: metricsTweet.public_metrics?.quote_count || 0,
							},
							author: {
								id: author?.id || '',
								handle: author?.username || 'unknown',
								name: author?.name || 'unknown',
								image: proxyMediaURL(author?.profile_image_url) || '/media/user_normal.png'
							},
						},
						ref_tweet: ref,

						url: proxyMediaURL(item.preview_image_url || item.url)!, //proxy for unoptimized images

						width: item.width,
						height: item.height,

						alt_text: item.alt_text,
						flagged: tweet.possibly_sensitive ? true : undefined,

						//video stuff
						duration_ms: item.duration_ms,
						view_count: item.public_metrics?.view_count,
						video_url: proxyMediaURL(videoURL),
						videolq_url: proxyMediaURL(videolqURL),
					});
				}
			});

			//Set the result count to items.length for an accurate result count.
			this.meta.result_count = this.items.length;
		}
	}
}