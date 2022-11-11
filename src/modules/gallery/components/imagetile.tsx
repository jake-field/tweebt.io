import styles from '../styles/tweet.module.css';
import Image from 'next/image';
import { MouseEventHandler, useState } from 'react';
import SpinnerIcon from '../../../common/icons/spinnericon';
import { Media } from '../types/gallery.types';
import TweetOverlay from './tweetoverlay';
import SpoilerOverlay from './spoileroverlay';
import TextOverlay from './textoverlay';
import { TileViewContext } from '../../../common/contexts/appsettings/view';
import { GifIcon, PlayCircleIcon } from '@heroicons/react/24/solid';

interface Props {
	item: Media;
	hidePoster?: boolean;
	ignoreMobile?: boolean
	onClick?: MouseEventHandler<any>;
}

export default function ImageTile({ item, hidePoster, ignoreMobile, onClick }: Props) {
	const [loaded, setLoaded] = useState(false); //true when image loads
	const [imgVisible, setImgVisible] = useState(false); //true when image completes opacity animation
	const [hover, setHover] = useState(false);
	const touchScreenMode = !ignoreMobile && window.matchMedia('(any-pointer: coarse)').matches;

	const imageElement = <Image
		className={styles.image + ` ${loaded ? 'opacity-100' : 'opacity-0'}`}
		src={item.url + '?name=small'} //pull smaller pre-compressed image from twitter
		width={item.width}
		height={item.height}
		alt={item.alt_text || item.tweet.text || ''}
		placeholder='empty'
		//quality={75} //consider changing this, but this is acceptable for mosaic formatting
		unoptimized={true} //save server processing stress
		onLoadingComplete={() => setLoaded(true)}
		onTransitionEnd={() => setImgVisible(true)}
		onClick={onClick}
		draggable={false}
	/>;

	return (
		<div
			className={styles.tile}
			onMouseOver={() => setHover(true)}
			onMouseOut={() => setHover(false)}
		>
			<span className={styles.container} draggable={false}>
				{item.flagged && <SpoilerOverlay />}

				{(!loaded || !imgVisible) &&
					<span className={styles.overlay}>
						<SpinnerIcon className={styles.loader + ` ${loaded ? 'opacity-0' : 'opacity-100'}`} />
					</span>
				}

				{(item.type !== 'photo' && imgVisible) &&
					<span className={styles.overlay}>
						<TileViewContext.Consumer>
							{({ autoplayVideos,autoplayGifs }) =>
								<>
									{item.type === 'video' && !(hover && autoplayVideos) && <PlayCircleIcon className={styles.playbutton + ' rounded-full'} />}
									{item.type === 'animated_gif' && !autoplayGifs && <GifIcon className={styles.playbutton + ' rounded-2xl px-[6px]'} />}
								</>
							}
						</TileViewContext.Consumer>
					</span>
				}

				{(item.alt_text || item.tweet.text) && touchScreenMode &&
					<TextOverlay item={item} showAltButton showTextButton parentVisibility={true} />
				}

				<a
					className=''
					href={item.video_url || item.url + '?name=orig'} //more control for mobile devices to serve the full image
					onClick={(e) => e.preventDefault()} //prevent navigating to the image itself
					draggable={false}
				>
					{item.type !== 'photo' && (item.videolq_url || item.video_url) ? (
						<TileViewContext.Consumer>
							{({ autoplayGifs, autoplayVideos, unmuteVideoOnHover }) =>
								<>
									{autoplayGifs && item.type === 'animated_gif' || autoplayVideos && item.type === 'video' ? (
										<video
											className={styles.video}
											poster={item.url} //required for safari/apple
											width={item.width}
											height={item.height}
											autoPlay
											playsInline
											loop
											muted={!(hover && unmuteVideoOnHover && item.type === 'video')}
											onPlay={() => { if (!loaded || !imgVisible) setLoaded(true); setImgVisible(true) }}
											onLoadedData={(e) => { if (!loaded || !imgVisible) setLoaded(true); setImgVisible(true); }} //iOS fix, only update if needed
											onClick={onClick}
											draggable={false}
										>
											{item.videolq_url && //compressed video first, 3 sources to ensure it plays on every device (meta sometimes comes scrambled with wrong duration)
												<>
													<source src={item.videolq_url + `?rnd=${Math.round(Math.random() * 1000)}`} type='video/mp4' />
													<source src={item.videolq_url} type='video/mp4' />
													<source src={item.videolq_url + '?tag=12'} type='video/mp4' />
													<source src={item.videolq_url + `#t=0,${item.duration_ms! / 1000}`} type='video/mp4' />
												</>
											}
											{item.video_url && //high quality last to save bandwidth
												<>
													<source src={item.video_url + `?rnd=${Math.round(Math.random() * 1000)}`} type='video/mp4' />
													<source src={item.video_url} type='video/mp4' />
													<source src={item.video_url + '?tag=12'} type='video/mp4' />
													<source src={item.video_url + `#t=0,${item.duration_ms! / 1000}`} type='video/mp4' />
												</>
											}
										</video>
									) : (
										<>{imageElement}</>
									)}
								</>
							}
						</TileViewContext.Consumer>
					) : (
						<>{imageElement}</>
					)}
				</a>
			</span>
			<TweetOverlay
				item={item}
				visible={hover || touchScreenMode}
				hidePoster={hidePoster}
				showMetrics={true}
				showTweetText={!touchScreenMode}
				mobilemode={touchScreenMode}
			/>
		</div >
	);
}