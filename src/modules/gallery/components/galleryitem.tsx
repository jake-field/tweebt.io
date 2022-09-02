import { PlayIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import { MouseEventHandler, useState } from 'react';
import { TileViewContext } from '../../../common/contexts/appsettings/view';
import { SpinnerIcon } from '../../../common/icons/spinnericon';
import { Media } from '../types/gallery';
import GalleryItemOverlay from './galleryitemoverlay';
import SpoilerOverlay from './spoileroverlay';
import TextOverlay from './textoverlay';

interface Props {
	item: Media;
	onClick?: MouseEventHandler<any>;
}

export default function GalleryMediaItem({ item, onClick }: Props) {
	const [loaded, setLoaded] = useState(false); //true when image loads
	const [imgVisible, setImgVisible] = useState(false); //true when image completes opacity animation
	const [hover, setHover] = useState(false);

	let mobilemode = false;
	let topAndBottomLayout = true;

	//force actions if touchscreen for now
	//consider putting this elsewhere or having a toggle
	if (window.matchMedia('(any-pointer: coarse)').matches) {
		// touchscreen
		mobilemode = true;
		topAndBottomLayout = false;
	}

	const image = <Image
		src={item.url + '?name=small'} //pull smaller pre-compressed image from twitter
		width={item.width}
		height={item.height}
		alt={item.alt_text || item.tweet.text}
		placeholder='empty'
		//quality={75} //consider changing this, but this is acceptable for mosaic formatting
		//unoptimized={true}
		onLoadingComplete={() => setLoaded(true)}
		onTransitionEnd={() => setImgVisible(true)}
		onClick={onClick}
		className={`transition-opacity object-cover ease-in duration-150 ${loaded ? 'opacity-100' : 'opacity-0'}`}
		layout='responsive'
		draggable={false}
	/>;

	return (
		<div
			className='flex flex-col rounded-lg overflow-hidden items-center my-2 mx-1 transition-shadow ease-in-out duration-150 shadow-lg cursor-pointer md:hover:ring-2 ring-blue-600 dark:ring-blue-400'
			onMouseOver={() => setHover(true)}
			onMouseOut={() => setHover(false)}
			style={{ contain: 'content' }}
		>
			<GalleryItemOverlay
				item={item}
				visible={hover || mobilemode}
				showMetrics={true}
				showTweetText={!mobilemode}
				topAndBottomLayout={!mobilemode}
				mobilemode={mobilemode}
			>
				<span className='w-full min-h-[200px] inline-grid' style={{ contain: 'content' }} draggable={false}>
					{item.flagged && <SpoilerOverlay />}
					{item.type === 'video' && imgVisible &&
						<TileViewContext.Consumer>
							{({ autoplayVideos }) =>
								<>
									{!autoplayVideos &&
										<div className='flex items-center justify-center w-full h-full absolute pointer-events-none z-10'>
											<PlayIcon className='w-1/4 text-gray-100 bg-gray-500 rounded-full opacity-80' />
										</div>
									}
								</>
							}
						</TileViewContext.Consumer>
					}

					{(!loaded || !imgVisible) &&
						<span className='absolute w-full h-full flex items-center justify-center pointer-events-none' style={{ contentVisibility: 'auto' }}>
							<SpinnerIcon className={`w-7 h-7 transition-opacity ease-in-out duration-300 ${loaded ? 'opacity-0' : 'opacity-100'}`} />
						</span>
					}

					<div className='absolute z-30 pointer-events-none flex flex-col w-full h-full justify-end items-end text-white text-xs text-left'>
						<TextOverlay item={item} showAltButton showTextButton parentVisibility={mobilemode} />
					</div>

					<a
						className='inline-grid'
						href={item.video_url || item.url + '?name=orig'} //more control for mobile devices to serve the full image
						onClick={(e) => e.preventDefault()} //prevent navigating to the image itself
						draggable={false}
					>
						{item.type !== 'photo' && (item.videolq_url || item.video_url) ? (
							<TileViewContext.Consumer>
								{({ autoplayVideos }) =>
									<>
										{autoplayVideos || item.type !== 'video' ? (
											<video
												className='w-full h-full min-h-[200px] object-cover'
												style={{ height: '-webkit-fill-available' }}
												poster={item.url}
												width={item.width}
												height={item.height}
												autoPlay
												playsInline
												loop
												muted
												onPlay={() => { setLoaded(true); setImgVisible(true) }}
												onClick={onClick}
											>
												<source src={item.videolq_url || item.video_url} type='video/mp4' />
											</video>
										) : (
											<>{image}</>
										)}
									</>
								}
							</TileViewContext.Consumer>
						) : (
							<>{image}</>
						)}
					</a>
				</span>
			</GalleryItemOverlay>
		</div >
	);
}