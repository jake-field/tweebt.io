import { PlayIcon } from "@heroicons/react/solid";
import { LikeIcon, ReplyIcon, RetweetIcon, TwitterIcon } from "../../icons/twittericons";
import { Media } from "../../shared/types/gallery";

interface Props {
	item: Media;
	visible: boolean;
	showMetrics?: boolean;
	showTweetText?:boolean
	children?: any;
}

export default function GalleryItemOverlay({ item, visible, showMetrics, showTweetText, children }: Props) {
	const iconClassName = 'w-4';

	//TODO: mobile setting, or forced setting on layout ideas
	let topAndBottomLayout = true;
	let mobilemode = false;

	function kFormatter(num: number) {
		return Math.abs(num) > 999 ? Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
	}

	function buildInteractionClassName(color: string) {
		const hoverColorClass = `text-${color}-400`;
		const baseColorClass = `text-white`;
		const baseClass = 'flex gap-1 transition-all ease-in-out duration-200 cursor-pointer ';
		const textClass = `${baseColorClass} visited:${baseColorClass} dark:${baseColorClass} dark:visited:${baseColorClass} `;
		const hoverClass = `hover:${hoverColorClass} dark:hover:${hoverColorClass}`;
		return (baseClass.concat(textClass, hoverClass));
	}

	//force actions if touchscreen for now
	//consider putting this elsewhere or having a toggle
	if (window.matchMedia("(pointer: coarse)").matches) {
		// touchscreen
		mobilemode = true;
		topAndBottomLayout = false;
		showTweetText = false;
		visible = true; //disabled until I can get the UX better
		showMetrics = false;
	}

	return (
		<>
			{!(topAndBottomLayout && mobilemode) && children}

			<div className={`${(topAndBottomLayout && !mobilemode) ? 'absolute' : ''} w-full h-full flex flex-col text-xs pointer-events-none text-white`}>
				<div className={`pointer-events-auto z-10 transition-all cursor-default relative ease-in-out duration-150 ${visible ? 'top-0' : '-top-20'}`}>
					<div className={`bg-black bg-opacity-70 backdrop-blur-sm flex gap-2 justify-center items-center py-2 px-1 flex-wrap`}>
						{item.author.name}
						{!item.referencing && <span className='uppercase text-slate-400'>@{item.author.username}</span>}
						{item.referencing && item.referencing[0].type !== 'replied_to' && (
							<svg className={`${iconClassName} text-green-400`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
								<path stroke='' fill='currentColor' d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path>
							</svg>
						)}
						{item.referencing && item.referencing[0].type === 'replied_to' && <span className='text-blue-400'>replied to</span>}
						{item.referencing && `@${item.referencing[0].username}`}
					</div>
					{item.text && showTweetText &&
						<div className={`bg-black bg-opacity-70 backdrop-blur-sm overflow-hidden p-1 border-t border-gray-900 border-opacity-70 transition-all ease-in-out duration-300 ${visible ? 'h-max' : 'h-0'}`}>
							{item.text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')}
						</div>
					}
				</div>

				{topAndBottomLayout && mobilemode && children}
				{topAndBottomLayout && !mobilemode && <div className='grow pointer-events-none' />}

				<div className={`z-20 pointer-events-auto cursor-default relative flex items-end transition-all ease-in-out duration-150 ${visible ? 'bottom-0' : '-bottom-11'}`}>
					<div className='bg-black bg-opacity-70 backdrop-blur-sm w-full flex justify-evenly items-center py-2 px-1'>
						<a
							title='Reply'
							className={buildInteractionClassName('blue')}
							href={`https://twitter.com/intent/tweet?in_reply_to=${item.tweet_id}`}
							target='_blank'
						>
							<ReplyIcon className={iconClassName} />
							{showMetrics && kFormatter(Number(item.metrics.replies))}
						</a>
						<a
							title='Retweet'
							className={buildInteractionClassName('green')}
							href={`https://twitter.com/intent/retweet?tweet_id=${item.tweet_id}`}
							target='_blank'
						>
							<RetweetIcon className={iconClassName} />
							{showMetrics && kFormatter(Number(item.metrics.retweets + item.metrics.quotes))}
						</a>
						<a
							title='Like'
							className={buildInteractionClassName('red')}
							href={`https://twitter.com/intent/like?tweet_id=${item.tweet_id}`}
							target='_blank'
						>
							<LikeIcon className={iconClassName} />
							{showMetrics && kFormatter(Number(item.metrics.likes))}
						</a>
						<a
							title='View on Twitter'
							className={buildInteractionClassName('blue')}
							href={`https://twitter.com/${item.author.username}/status/${item.tweet_id}`}
							target='_blank'
						>
							<TwitterIcon className={iconClassName} />
						</a>
					</div>
				</div>
			</div>
		</>
	)
}