import Image from 'next/image';
import Link from 'next/link';
import { RetweetIcon } from '../../../common/icons/twittericons';
import { Media } from '../types/gallery';
import MetricsList from './metricslist';
import TextOverlay from './textoverlay';

interface Props {
	item: Media;
	visible: boolean;
	showMetrics?: boolean;
	showTweetText?: boolean;
	children?: any;
	topAndBottomLayout: boolean;
	mobilemode: boolean;
}

export default function GalleryItemOverlay({ item, visible, showMetrics, showTweetText, children, topAndBottomLayout, mobilemode }: Props) {
	const bannerClass = 'pointer-events-auto transition-all bg-black bg-opacity-70 backdrop-blur-sm items-center py-2 px-1 flex cursor-default relative ease-in-out duration-150';
	const linkClass = 'text-white visited:text-white dark:text-white dark:visited:text-white hover:text-blue-300 dark:hover:text-blue-300 hover:underline underline-offset-4';

	return (
		<>
			{!(topAndBottomLayout && mobilemode) && children}

			<div className={`${(topAndBottomLayout && !mobilemode) ? 'absolute' : ''} w-full h-full flex flex-col text-xs md:text-sm pointer-events-none text-white`}>
				<div className={`${bannerClass} z-10 gap-2 justify-center select-text flex-wrap ${visible ? 'top-0' : '-top-20'}`}>
					<Link href={`/@${item.tweet.author.handle}`}>
						<a
							title={`View ${item.tweet.author.name}'s (@${item.tweet.author.handle}) Profile`}
							className={linkClass + ' flex flex-wrap items-center justify-center gap-1'}
						>
							<Image
								src={item.tweet.author.image}
								alt={item.tweet.author.name + '\'s profile image'}
								width={24}
								height={24}
								className='rounded-full'
							/>
							{item.tweet.author.name}{!item.ref_tweet ? <span className='text-gray-300 font-light'>@{item.tweet.author.handle}</span> : ''}
						</a>
					</Link>

					{item.ref_tweet &&
						<>
							{item.ref_tweet.type === 'retweeted' ? (
								<span
									title={`${item.tweet.author.name} retweeted ${item.ref_tweet.author.handle === item.tweet.author.handle ? 'themself' : item.ref_tweet.author.name}`}
									className='flex gap-2 items-center justify-center text-green-400'
								>
									<RetweetIcon className={'w-4'} />{item.ref_tweet.author.handle === item.tweet.author.handle ? ' themself' : ''}
								</span>
							) : (
								<span
									title={`${item.tweet.author.name} ${item.ref_tweet.type!.replace('_', ' ')} ${item.ref_tweet.author.handle === item.tweet.author.handle ? 'themselves' : item.ref_tweet.author.name}`}
									className='text-blue-400'
								>
									{item.ref_tweet.type!.replace('_', ' ')}{item.ref_tweet.author.handle === item.tweet.author.handle ? ' themselves' : ''}
								</span>
							)}

							{item.ref_tweet.author.handle !== item.tweet.author.handle &&
								<Link href={`/@${item.ref_tweet.author.handle}`}>
									<a
										title={`View ${item.ref_tweet.author.name}'s (@${item.ref_tweet.author.handle}) Profile`}
										className={linkClass + ' flex flex-wrap items-center justify-center gap-1'}
									>
										<Image
											src={item.ref_tweet.author.image}
											alt={item.ref_tweet.author.name + '\'s profile image'}
											width={24}
											height={24}
											className='rounded-full'
										/>
										@{item.ref_tweet.author.handle}
									</a>
								</Link>
							}

						</>
					}
				</div>

				{topAndBottomLayout && mobilemode && children}
				{topAndBottomLayout && showTweetText &&
					<div className='grow pointer-events-none text-left h-0' style={{ contain: 'content' }}>
						<TextOverlay item={item} showTextButton showAltButton parentVisibility={visible} />
					</div>
				}

				<div className={`${bannerClass} z-20 justify-evenly ${visible ? 'bottom-0' : '-bottom-11'}`}>
					<MetricsList item={item} hideNumbers={!showMetrics} />
				</div>
			</div>
		</>
	)
}