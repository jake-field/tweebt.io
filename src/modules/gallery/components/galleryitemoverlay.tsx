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

			<div className={`${(topAndBottomLayout && !mobilemode) ? 'absolute' : ''} w-full h-full flex flex-col text-xs pointer-events-none text-white`}>
				<div className={`${bannerClass} z-10 gap-2 justify-center select-text flex-wrap ${visible ? 'top-0' : '-top-20'}`}>
					<Link href={`/@${item.author.username}`}>
						<a
							title={`View ${item.author.name}'s (@${item.author.username}) Profile`}
							className={linkClass + ' flex flex-wrap items-center justify-center gap-1'}
						>
							<Image
								src={item.author.profile_image_url}
								alt={item.author.name + '\'s profile image'}
								width={24}
								height={24}
								className='rounded-full'
							/>
							{item.author.name}{!item.referencing ? <span className='text-gray-300 font-light'>@{item.author.username}</span> : ''}
						</a>
					</Link>

					{item.referencing &&
						<>
							{item.referencing[0].type === 'retweeted' ? (
								<span
									title={`${item.author.name} retweeted ${item.referencing[0].username === item.author.username ? 'themself' : item.referencing[0].name}`}
									className='flex gap-2 items-center justify-center text-green-400'
								>
									<RetweetIcon className={'w-4'} />{item.referencing[0].username === item.author.username ? ' themself' : ''}
								</span>
							) : (
								<span
									title={`${item.author.name} ${item.referencing[0].type.replace('_', ' ')} ${item.referencing[0].username === item.author.username ? 'themselves' : item.referencing[0].name}`}
									className='text-blue-400'
								>
									{item.referencing[0].type.replace('_', ' ')}{item.referencing[0].username === item.author.username ? ' themselves' : ''}
								</span>
							)}

							{item.referencing[0].username !== item.author.username &&
								<Link href={`/@${item.referencing[0].username}`}>
									<a
										title={`View ${item.referencing[0].name}'s (@${item.referencing[0].username}) Profile`}
										className={linkClass + ' flex flex-wrap items-center justify-center gap-1'}
									>
										<Image
											src={item.referencing[0].profile_image_url}
											alt={item.referencing[0].name + '\'s profile image'}
											width={24}
											height={24}
											className='rounded-full'
										/>
										@{item.referencing[0].username}
									</a>
								</Link>
							}

						</>
					}

					{/* {!mobilemode && item.text && item.text.length > 0 && showTweetText &&
						<p className={`p-1 overflow-hidden cursor-text pb-0 w-full border-t border-gray-900 border-opacity-70 transition-all ease-in-out duration-300 ${visible ? 'h-max' : 'h-0'}`}>
							{formattedText}
						</p>
					} */}
				</div>

				{topAndBottomLayout && mobilemode && children}
				{topAndBottomLayout && !mobilemode &&
					<div className='grow pointer-events-none text-left' style={{ contain: 'content' }}>
						{/* TODO: showOnHover needs a delay bound to it so that it doesn't open instantly when moving the mouse around */}
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