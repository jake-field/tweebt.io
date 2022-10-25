import { LikeIcon, ReplyIcon, RetweetIcon, TwitterIcon } from "../../../common/icons/twittericons";
import { formatNumber, pluralize } from "../../../common/utils/formatnumber";
import { Media } from "../types/gallery";

interface Props {
	item: Media;
	showNumbers?: boolean;
}

export default function TweetMetrics({ item, showNumbers }: Props) {
	const isRetweet = (item.ref_tweet?.type === 'retweeted');
	const tweetHandle = isRetweet ? item.ref_tweet?.author.handle : item.tweet.author.handle;
	const tweetID = isRetweet ? item.ref_tweet?.id : item.tweet.id;

	return (
		<>
			<a
				title={`Reply (${pluralize(item.tweet.metrics!.replies, 'repl', 'y', 'ies')})`}
				href={`https://twitter.com/intent/tweet?in_reply_to=${tweetID}`}
			>
				<ReplyIcon />
				{showNumbers && <span>{formatNumber(item.tweet.metrics!.replies)}</span>}
			</a>
			<a
				title={`Retweet (${pluralize(item.tweet.metrics!.retweets + item.tweet.metrics!.quotes, 'retweet')})`}
				className='hover:text-green-400 dark:hover:text-green-400'
				href={`https://twitter.com/intent/retweet?tweet_id=${tweetID}`}
			>
				<RetweetIcon />
				{showNumbers && <span>{formatNumber(item.tweet.metrics!.retweets + item.tweet.metrics!.quotes)}</span>}
			</a>
			<a
				title={`Like (${pluralize(item.tweet.metrics!.likes, 'like')})`}
				className='hover:text-red-400 dark:hover:text-red-400'
				href={`https://twitter.com/intent/like?tweet_id=${tweetID}`}
			>
				<LikeIcon />
				{showNumbers && <span>{formatNumber(item.tweet.metrics!.likes)}</span>}
			</a>
			<a
				title={`View on Twitter (Posted ${item.tweet.created_at})`}
				href={`https://twitter.com/${tweetHandle}/status/${tweetID}`}
			>
				<TwitterIcon />
				<p className='text-gray-400'>{item.tweet.created_at_short}</p>
			</a>
		</>
	)
}