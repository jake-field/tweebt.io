import styles from '../styles/tweet.module.css';
import Image from 'next/image';
import { AnchorHTMLAttributes, useEffect, useState } from 'react';
import { LikeIcon, ReplyIcon, RetweetIcon, TwitterIcon } from 'common/icons/twittericons';
import { formatNumber, pluralize } from 'common/utils/formatnumber';
import { Media } from '../types/gallery.types';
import { ArrowRightIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/solid';
import { FilmIcon, GifIcon } from '@heroicons/react/24/outline';
import useWindowDimensions from 'common/utils/windowresizehook';

interface Props {
	target?: HTMLElement;
	item?: Media;
}

export default function TileOverlay({ target, item }: Props) {
	const [storedTarget, setStoredTarget] = useState<HTMLElement | undefined>();
	const [visible, setVisible] = useState(false);
	const [selfHover, setSelfHover] = useState(false);

	//DO NOT DELETE THIS LINE
	//Using a hook here to force a re-render on window resize, which updates the size/position of the overlay on resize
	useWindowDimensions(); //Force component update on window resize

	useEffect(() => {
		setVisible(target ? true : false);
		if (target) setStoredTarget(target);
	}, [target]);

	//Don't render on first page load, no point. Once user hovers, this component will stay rendered.
	if (!item) return <></>;

	const isRetweet = (item.ref_tweet?.type === 'retweeted');
	const isQuote = (item.ref_tweet?.type === 'quoted');
	const isReply = (item.ref_tweet?.type === 'replied_to');
	const referencingSelf = (item.ref_tweet?.author.handle === item.tweet.author.handle);
	const tweetHandle = isRetweet ? item.ref_tweet?.author.handle : item.tweet.author.handle;
	const tweetID = isRetweet ? item.ref_tweet?.id : item.tweet.id;
	const extLinkAttributes: AnchorHTMLAttributes<HTMLAnchorElement> = { target: '_blank', rel: 'noreferrer' };

	return (
		<div
			className={`${styles.metriccontainer} ${(visible || selfHover) ? 'opacity-100' : 'opacity-0'} absolute`}
			style={{ top: storedTarget?.offsetTop, left: storedTarget?.offsetLeft, width: storedTarget?.offsetWidth, height: storedTarget?.offsetHeight }}
			onMouseEnter={() => setSelfHover(true)}
			onMouseLeave={() => setSelfHover(false)}
		>
			<div className={styles.metricauthors}>
				<a
					href={`/@${item.tweet.author.handle}`}
					title={`View ${item.tweet.author.name}'s (@${item.tweet.author.handle}) Profile`}
					className='hover:text-blue-400 dark:hover:text-blue-400'
					style={{ minWidth: (item.ref_tweet && !referencingSelf) ? 'auto' : '0px' }}
				>
					<Image src={item.tweet.author.image} alt={item.tweet.author.name + '\'s profile image'} width={36} height={36} />
					{(!item.ref_tweet || referencingSelf) &&
						<span className='flex flex-col min-w-0 flex-nowrap items-start justify-center pr-2'>
							<p className='text-xs sm:text-sm text-gray-100 font-medium text-ellipsis overflow-hidden whitespace-nowrap max-w-full'>{item.tweet.author.name}</p>
							<p className='text-xs text-gray-300 font-normal italic text-ellipsis overflow-hidden whitespace-nowrap max-w-full'>@{item.tweet.author.handle}</p>
						</span>
					}
				</a>
				{item.ref_tweet &&
					<p
						title={`@${item.tweet.author.handle} ${item.ref_tweet.type?.replace('_', ' ')} ${referencingSelf ? 'their own tweet' : '@' + item.ref_tweet.author.handle}`}
						className='pointer-events-auto'
					>
						{(isRetweet || isQuote) && <RetweetIcon className='text-green-400 h-full' />}
						{isReply && !referencingSelf && <ArrowRightIcon className='text-blue-400 h-full' />}
						{isReply && referencingSelf && <ArrowUturnLeftIcon className='text-blue-400 h-full' />}
					</p>
				}
				{item.ref_tweet && !referencingSelf &&
					<a
						href={`/@${item.ref_tweet.author.handle}`}
						title={`View ${item.ref_tweet.author.name}'s (@${item.ref_tweet.author.handle}) Profile`}
						className='hover:text-blue-400 dark:hover:text-blue-400'
					>
						<Image src={item.ref_tweet.author.image} alt={item.ref_tweet.author.name + '\'s profile image'} width={36} height={36} />
						<span className='flex flex-col min-w-0 flex-nowrap items-start justify-center pr-2'>
							<p className='text-xs sm:text-sm text-gray-100 font-medium text-ellipsis overflow-hidden whitespace-nowrap max-w-full'>{item.ref_tweet.author.name}</p>
							<p className='text-xs text-gray-300 italic text-ellipsis overflow-hidden whitespace-nowrap max-w-full'>@{item.ref_tweet.author.handle}</p>
						</span>
					</a>
				}
			</div>
			<div className={styles.metrics}>
				{item.type === 'animated_gif' && <GifIcon title='Animated GIF' />}
				{item.type === 'video' && <FilmIcon title='Video' />}
				<a
					title={`Reply (${pluralize(item.tweet.metrics!.replies, 'repl', 'y', 'ies')})`}
					className='hover:text-blue-400 dark:hover:text-blue-400'
					href={`https://twitter.com/intent/tweet?in_reply_to=${tweetID}`}
					{...extLinkAttributes}
				>
					<span>{formatNumber(item.tweet.metrics!.replies)}</span>
					<ReplyIcon />
				</a>
				<a
					title={`Retweet (${pluralize(item.tweet.metrics!.retweets + item.tweet.metrics!.quotes, 'retweet')})`}
					className='hover:text-green-400 dark:hover:text-green-400'
					href={`https://twitter.com/intent/retweet?tweet_id=${tweetID}`}
					{...extLinkAttributes}
				>
					<span>{formatNumber(item.tweet.metrics!.retweets + item.tweet.metrics!.quotes)}</span>
					<RetweetIcon />
				</a>
				<a
					title={`Like (${pluralize(item.tweet.metrics!.likes, 'like')})`}
					className='hover:text-red-400 dark:hover:text-red-400'
					href={`https://twitter.com/intent/like?tweet_id=${tweetID}`}
					{...extLinkAttributes}
				>
					<span>{formatNumber(item.tweet.metrics!.likes)}</span>
					<LikeIcon />
				</a>
				<a
					title={`View on Twitter (Posted ${item.tweet.created_at})`}
					href={`https://twitter.com/${tweetHandle}/status/${tweetID}`}
					className='hover:text-blue-400 dark:hover:text-blue-400'
					{...extLinkAttributes}
				>
					<span className='capitalize'>{item.tweet.created_at}</span>
					<TwitterIcon />
				</a>
			</div>
		</div>
	)
}