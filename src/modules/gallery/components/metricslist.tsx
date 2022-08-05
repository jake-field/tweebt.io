import { AnchorHTMLAttributes } from "react";
import { LikeIcon, ReplyIcon, RetweetIcon, TwitterIcon } from "../../../common/icons/twittericons";
import { Media } from "../types/gallery";

interface Props {
	item: Media;
	hideNumbers?: boolean;
}

export default function MetricsList({ item, hideNumbers }: Props) {
	const className = 'flex gap-1 transition-all ease-in-out duration-200 cursor-pointer text-white visited:text-white dark:text-white dark:visited:text-white';
	const isRetweet = (item.referencing && item.referencing[0].type === 'retweeted') || false;
	const tweetHandle = isRetweet ? item.referencing![0].username : item.author.username;
	const tweetID = isRetweet ? item.referencing![0].tweet_id : item.tweet_id;
	const sharedAttrb: AnchorHTMLAttributes<HTMLAnchorElement> = { target: '_blank', rel: 'noreferrer' };

	//Format a number such that 10,500 becomes 10.5k
	function formatNumber(n: number, precision: number = 1) {
		return n > 999 ? (n / 1000).toFixed(precision) + 'k' : n;
	}

	//small helper for numbers
	function pluralize(n: number, str: string, singular = '', plural = 's') {
		return `${n} ${str}${n === 1 ? singular : plural}`;
	}

	return (
		<>
			<a
				title={`Reply (${pluralize(item.metrics.replies, 'repl', 'y', 'ies')})`}
				className={`${className} hover:text-blue-400 dark:hover:text-blue-400`}
				href={`https://twitter.com/intent/tweet?in_reply_to=${tweetID}`}
				{...sharedAttrb}
			>
				<ReplyIcon className='w-4' />
				{!hideNumbers && formatNumber(item.metrics.replies)}
			</a>
			<a
				title={`Retweet (${pluralize(item.metrics.retweets + item.metrics.quotes, 'retweet')})`}
				className={`${className} hover:text-green-400 dark:hover:text-green-400`}
				href={`https://twitter.com/intent/retweet?tweet_id=${tweetID}`}
				{...sharedAttrb}
			>
				<RetweetIcon className='w-4' />
				{!hideNumbers && formatNumber(item.metrics.retweets + item.metrics.quotes)}
			</a>
			<a
				title={`Like (${pluralize(item.metrics.likes, 'like')})`}
				className={`${className} hover:text-red-400 dark:hover:text-red-400`}
				href={`https://twitter.com/intent/like?tweet_id=${tweetID}`}
				{...sharedAttrb}
			>
				<LikeIcon className='w-4' />
				{!hideNumbers && formatNumber(item.metrics.likes)}
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