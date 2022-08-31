import { AnchorHTMLAttributes } from "react";
import { LikeIcon, ReplyIcon, RetweetIcon, TwitterIcon } from "../../../common/icons/twittericons";
import { formatNumber, pluralize } from "../../../common/utils/formatnumber";
import { Media } from "../types/gallery";

interface Props {
	item: Media;
	hideNumbers?: boolean;
}

export default function MetricsList({ item, hideNumbers }: Props) {
	const className = 'flex gap-1 cursor-pointer text-white visited:text-white dark:text-white dark:visited:text-white';
	const isRetweet = (item.ref_tweet?.type === 'retweeted') || false;
	const tweetHandle = isRetweet ? item.ref_tweet?.author.handle : item.tweet.author.handle;
	const tweetID = isRetweet ? item.ref_tweet?.id : item.tweet.id;
	const sharedAttrb: AnchorHTMLAttributes<HTMLAnchorElement> = { target: '_blank', rel: 'noreferrer' };
	
	return (
		<>
			<a
				title={`Reply (${pluralize(item.tweet.metrics!.replies, 'repl', 'y', 'ies')})`}
				className={`${className} hover:text-blue-400 dark:hover:text-blue-400`}
				href={`https://twitter.com/intent/tweet?in_reply_to=${tweetID}`}
				{...sharedAttrb}
			>
				<ReplyIcon className='w-4' />
				<span className='hidden sm:block'>{!hideNumbers && formatNumber(item.tweet.metrics!.replies)}</span>
			</a>
			<a
				title={`Retweet (${pluralize(item.tweet.metrics!.retweets + item.tweet.metrics!.quotes, 'retweet')})`}
				className={`${className} hover:text-green-400 dark:hover:text-green-400`}
				href={`https://twitter.com/intent/retweet?tweet_id=${tweetID}`}
				{...sharedAttrb}
			>
				<RetweetIcon className='w-4' />
				<span className='hidden sm:block'>{!hideNumbers && formatNumber(item.tweet.metrics!.retweets + item.tweet.metrics!.quotes)}</span>
			</a>
			<a
				title={`Like (${pluralize(item.tweet.metrics!.likes, 'like')})`}
				className={`${className} hover:text-red-400 dark:hover:text-red-400`}
				href={`https://twitter.com/intent/like?tweet_id=${tweetID}`}
				{...sharedAttrb}
			>
				<LikeIcon className='w-4' />
				<span className='hidden sm:block'>{!hideNumbers && formatNumber(item.tweet.metrics!.likes)}</span>
			</a>
			<a
				title='View on Twitter'
				className={`${className} hover:text-blue-400 dark:hover:text-blue-400`}
				href={`https://twitter.com/${tweetHandle}/status/${tweetID}`}
				{...sharedAttrb}
			>
				<TwitterIcon className='w-4' />
			</a>
		</>
	)
}