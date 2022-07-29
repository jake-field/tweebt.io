import Timeline, { Meta } from '../../twitterapi/types/timeline';

export interface Author {
	id: string;
	username: string;
	name: string;
}

export interface Media {
	key: string;
	tweet_id: string;
	author: Author;

	//todo: consider single object rather than array
	//todo: rename to referenced_tweet
	//todo: consider using author here
	referencing?: {
		type: 'retweeted' | 'replied_to' | 'quoted';
		id: string;
		name: string;
		username: string;
		tweet_id: string;
		text: string; //original tweet text
	}[];

	type: string;
	url: string;
	width: number;
	height: number;

	//rename to flagged_sensitive to avoid potential legal issues
	nsfw?: boolean;

	//tweet text
	text?: string;
	alt_text?: string; //img alt-text

	//will be replaced with referenced tweet metrics if it's a retweet
	//todo: consider if this is wise
	metrics: {
		retweets: number;
		replies: number;
		likes: number;
		quotes: number;
	}
}

export interface Error {
	title: string;
	detail: string;
}

export default class Gallery {
	meta: Meta;
	items: Media[];
	error?: Error;

	//Constructor from Timeline
	constructor(timeline: Timeline) {
		//TODO: meta sometimes comes back as undefined, usually an error is in tow
		this.meta = timeline.meta || { result_count: 0 };
		this.items = [];

		if (timeline.data && timeline.includes?.media) {
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
							id: user?.id || author?.id || '',
							text: refTweet?.text || 'Deleted/Protected Tweet',

							//Sometimes user won't be valid due to a protected/deleted tweet
							//In this case, try match the username from the tweet text
							//	or use the author username as Twitter has a special redirect for threads
							name: user?.name || tweet.text.match(/^(?:@)(\w*)/i)?.at(1) || author?.name || '',
							username: user?.username || tweet.text.match(/^(?:@)(\w*)/i)?.at(1) || author?.username || '',

							//Use this tweet id if the original is deleted/protected, this allows us to still show the reference in some form
							tweet_id: refTweet?.id || tweet.id,
						}
					}) : undefined;

					//TODO: if this doesn't fire, consider replacing the array with a single reference object
					if (referencing && referencing?.length > 1) {
						console.log('TODO: IF THIS MESSAGE APPEARS AND THE ARRAY IS WORTH KEEPING, DONT CONVERT TO SINGLE OBJECT');
						console.log('multiple references attached to tweet', tweet.id);
						console.log(referencing);
					}

					if (referencing && referencing[0].tweet_id === tweet.id) {
						console.log(`tweet reference has issues:`, referencing[0]);
					}

					//get the correct metrics, if we're dealing with an original tweet, metrics are accurate
					//	if we are dealing with a retweet, only the retweets are stored in the tweet variable
					//	however, the accurate metrics are held under includes.tweets
					//
					// USING RETWEETED CHECK AS WE NEED TO USE THE ORIGINAL METRICS FOR REPLIES, QUOTES AND ORIGINAL TWEETS
					let metricsTweet = referencing && referencing[0].type === 'retweeted' ? timeline.includes?.tweets?.find(t => t.id === referencing[0].tweet_id) || tweet : tweet;
					let correctMetrics = {
						replies: metricsTweet.public_metrics?.reply_count || 0,
						likes: metricsTweet.public_metrics?.like_count || 0,
						retweets: metricsTweet.public_metrics?.retweet_count || 0,
						quotes: metricsTweet.public_metrics?.quote_count || 0,
					};

					//prep tweet text by stripping the RT information and the 'twitter quick link' at the end of every tweet from the api
					//don't strip the leading @ if we are referencing someone as there is no twitter prepended @
					let tweetText = tweet.text;
					if(referencing) tweetText = tweetText.replaceAll(/(^(RT )?@[a-z0-9_]*:? )|( ?https:\/\/t.co\/\w* ?)*$/gim, '');
					else tweetText = tweetText.replaceAll(/( ?https:\/\/t.co\/\w* ?)*$/gim, '');

					//push to the response items array
					this.items.push({
						key: item.media_key,
						tweet_id: tweet.id,
						author: {
							id: author?.id || '',
							username: author?.username || 'unknown',
							name: author?.name || 'unknown',
						},
						referencing: referencing,
						text: tweetText,
						alt_text: item.alt_text,
						type: item.type,
						url: (item.preview_image_url || item.url).replace(/https:\/\/pbs.twimg.com\//, '/img/'), //proxy for unoptimized images
						width: item.width,
						height: item.height,
						nsfw: tweet.possibly_sensitive ? true : undefined,
						metrics: correctMetrics
					});
				}
			});

			//Set the result count to items.length for an accurate result count.
			this.meta.result_count = this.items.length;
		}
	}
}