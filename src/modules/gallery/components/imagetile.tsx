import styles from '../styles/tweet.module.css';
import { PlayIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import { MouseEventHandler, useState } from 'react';
import { SpinnerIcon } from '../../../common/icons/spinnericon';
import { Media } from '../types/gallery';
import TweetOverlay from './tweetoverlay';
import SpoilerOverlay from './spoileroverlay';
import TextOverlay from './textoverlay';

interface Props {
	item: Media;
	onClick?: MouseEventHandler<any>;
}

export default function ImageTile({ item, onClick }: Props) {
	const [loaded, setLoaded] = useState(false); //true when image loads
	const [imgVisible, setImgVisible] = useState(false); //true when image completes opacity animation
	const [hover, setHover] = useState(false);
	const touchScreenMode = window.matchMedia('(any-pointer: coarse)').matches;

	return (
		<div
			className={styles.tile}
			onMouseOver={() => setHover(true)}
			onMouseOut={() => setHover(false)}
		>
			<span className={styles.container} draggable={false}>
				{item.flagged && <SpoilerOverlay />}

				{(!loaded || item.type === 'video') &&
					<span className={styles.overlay}>
						{(!loaded || !imgVisible) && <SpinnerIcon className={styles.loader + ` ${loaded ? 'opacity-0' : 'opacity-100'}`} />}
						{item.type === 'video' && imgVisible && <PlayIcon className={styles.playbutton} />}
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
					{item.type === 'animated_gif' && (item.videolq_url || item.video_url) ? (
						<video
							className={styles.video}
							poster={item.url} //required for safari/apple
							width={item.width}
							height={item.height}
							autoPlay //consider swapping this for onHover(200ms)
							playsInline //fails on iOS sometimes if there is an audio track (quicktime issue?)
							loop
							muted
							onPlay={() => { if (!loaded || !imgVisible) setLoaded(true); setImgVisible(true) }}
							onLoadedData={(e) => { if (!loaded || !imgVisible) setLoaded(true); setImgVisible(true); }} //iOS fix, only update if needed
							onClick={onClick}
							draggable={false}
						>
							<source src={item.videolq_url || item.video_url} type='video/mp4' />
						</video>
					) : (
						<Image
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
						/>
					)}
				</a>
			</span>
			<TweetOverlay
				item={item}
				visible={hover || touchScreenMode}
				showMetrics={true}
				showTweetText={!touchScreenMode}
				mobilemode={touchScreenMode}
			/>
		</div >
	);
}