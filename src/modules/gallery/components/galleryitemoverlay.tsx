import Link from 'next/link';
import { LikeIcon, ReplyIcon, RetweetIcon, TwitterIcon } from '../../../common/icons/twittericons';
import { Media } from '../types/gallery';

interface Props {
	item: Media;
	visible: boolean;
	showMetrics?: boolean;
	showTweetText?: boolean;
	children?: any;
}

export default function GalleryItemOverlay({ item, visible, showMetrics, showTweetText, children }: Props) {
	const iconClassName = 'w-4';
	const interactionClassName = 'flex gap-1 transition-all ease-in-out duration-200 cursor-pointer text-white visited:text-white dark:text-white dark:visited:text-white';
	const linkClassName = 'text-white visited:text-white dark:text-white dark:visited:text-white hover:text-blue-300 dark:hover:text-blue-300 hover:underline underline-offset-4';

	//TODO: mobile setting, or forced setting on layout ideas
	let topAndBottomLayout = true;
	let mobilemode = false;

	function kFormatter(num: number) {
		return Math.abs(num) > 999 ? Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
	}

	//force actions if touchscreen for now
	//consider putting this elsewhere or having a toggle
	if (window.matchMedia('(pointer: coarse)').matches) {
		// touchscreen
		mobilemode = true;
		topAndBottomLayout = false;
		showTweetText = false;
		visible = true;
		showMetrics = false;
	}

	return (
		<>
			{!(topAndBottomLayout && mobilemode) && children}

			<div className={`${(topAndBottomLayout && !mobilemode) ? 'absolute' : ''} w-full h-full flex flex-col text-xs pointer-events-none text-white`}>
				<div className={`pointer-events-auto z-10 transition-all cursor-default relative ease-in-out duration-150 ${visible ? 'top-0' : '-top-20'}`}>
					<div className={`bg-black bg-opacity-70 backdrop-blur-sm flex gap-2 justify-center items-center py-2 px-1 flex-wrap`}>
						<Link href={`/@${item.author.username}`}>
							<a title={`View ${item.author.name}'s (@${item.author.username}) Profile`} className={linkClassName}>{item.author.name}{!item.referencing ? <span className='text-gray-300 font-light'>&nbsp;&nbsp;@{item.author.username}</span> : ''}</a>
						</Link>

						{item.referencing &&
							<>
								{item.referencing[0].type === 'retweeted' ? (
									<span title='retweeted'>
										<svg className={`${iconClassName} text-green-400`} xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
											<path stroke='' fill='currentColor' d='M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z'></path>
										</svg>
									</span>
								) : (
									<span title={item.referencing[0].type.replace('_', ' ')} className='text-blue-400'>{item.referencing[0].type.replace('_', ' ')}</span>
								)}

								<Link href={`/@${item.referencing[0].username}`}>
									<a
										title={`View ${item.referencing[0].name}'s (@${item.referencing[0].username}) Profile`}
										className={linkClassName}
									>
										{item.referencing[0].username !== item.author.username ? '@' + item.referencing[0].username : 'themself'}
									</a>
								</Link>
							</>
						}
					</div>

					{item.text && item.text.length > 0 && showTweetText &&
						<div className={`bg-black bg-opacity-70 backdrop-blur-sm overflow-hidden p-1 border-t border-gray-900 border-opacity-70 transition-all ease-in-out duration-300 ${visible ? 'h-max' : 'h-0'}`}>
							{item.text.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&')}
						</div>
					}
				</div>

				{topAndBottomLayout && mobilemode && children}
				{topAndBottomLayout && !mobilemode &&
					<div className='grow pointer-events-none flex flex-col justify-end items-end p-2'>
						{item.alt_text && <span title={item.alt_text} className={`p-1 px-2 bg-black bg-opacity-70 text-white pointer-events-auto rounded-lg uppercase font-bold ${visible ? 'block' : 'hidden'}`}>Alt</span>}
					</div>
				}

				<div className={`z-20 pointer-events-auto cursor-default relative flex items-end transition-all ease-in-out duration-150 ${visible ? 'bottom-0' : '-bottom-11'}`}>
					<div className='bg-black bg-opacity-70 backdrop-blur-sm w-full flex justify-evenly items-center py-2 px-1'>
						<a
							title='Reply'
							className={`${interactionClassName} hover:text-blue-400 dark:hover:text-blue-400`}
							href={`https://twitter.com/intent/tweet?in_reply_to=${item.referencing && item.referencing[0].type === 'retweeted' ? item.referencing[0].tweet_id : item.tweet_id}`}
							target='_blank'
						>
							<ReplyIcon className={iconClassName} />
							{showMetrics && kFormatter(Number(item.metrics.replies))}
						</a>
						<a
							title='Retweet'
							className={`${interactionClassName} hover:text-green-400 dark:hover:text-green-400`}
							href={`https://twitter.com/intent/retweet?tweet_id=${item.referencing && item.referencing[0].type === 'retweeted' ? item.referencing[0].tweet_id : item.tweet_id}`}
							target='_blank'
						>
							<RetweetIcon className={iconClassName} />
							{showMetrics && kFormatter(Number(item.metrics.retweets + item.metrics.quotes))}
						</a>
						<a
							title='Like'
							className={`${interactionClassName} hover:text-red-400 dark:hover:text-red-400`}
							href={`https://twitter.com/intent/like?tweet_id=${item.referencing && item.referencing[0].type === 'retweeted' ? item.referencing[0].tweet_id : item.tweet_id}`}
							target='_blank'
						>
							<LikeIcon className={iconClassName} />
							{showMetrics && kFormatter(Number(item.metrics.likes))}
						</a>
						<a
							title='View on Twitter'
							className={`${interactionClassName} hover:text-blue-400 dark:hover:text-blue-400`}
							href={`https://twitter.com/${item.referencing && item.referencing[0].type === 'retweeted' ? item.referencing[0].username : item.author.username}/status/${item.referencing && item.referencing[0].type === 'retweeted' ? item.referencing[0].tweet_id : item.tweet_id}`}
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