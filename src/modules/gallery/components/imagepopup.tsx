import styles from '../styles/popup.module.css';
import Image from 'next/image';
import { MouseEventHandler, useEffect, useState } from 'react';
import SpinnerIcon from '../../../common/icons/spinnericon';
import { Media } from '../types/gallery.types';

interface Props {
	item?: Media;
	onClick: MouseEventHandler<HTMLDivElement>;
}

export default function ImagePopup({ item, onClick }: Props) {
	const [loaded, setLoaded] = useState(false);
	const [visible, setVisible] = useState(false);
	const [videoVis, setVideoVis] = useState(true);
	const [imgVisible, setImgVisible] = useState(false); //true when image completes opacity animation

	//testing for video fixes
	function isAppleTouchDevice() {
		return /iPhone|iPad|iPod/gi.test(navigator.userAgent) || (/AppleWebKit/gi.test(navigator.userAgent) && navigator.maxTouchPoints > 0);
	}

	//when galleryItem changes, force loaded to false so we get the loading indicator
	useEffect(() => {
		//hide scrollbars on open, force fixed for the sake of mobile, then restore scroll on close
		const scroll = document.body.style.top;
		const s = -(scrollY).toString();
		document.body.style.overflowY = item ? 'hidden' : '';
		document.body.style.position = item ? 'fixed' : '';
		document.body.style.top = item ? `${s}px` : '';
		document.body.style.width = item ? '100%' : '';

		if (!item) {
			const num = Number(scroll.substring(0, scroll.indexOf('px')));
			scrollTo({ top: -num });
		}

		//if on mobile, make the background black so that the device browser has consistent ui colors
		if (window.matchMedia('(pointer: coarse)').matches) document.body.style.backgroundColor = item ? 'black' : '';

		//Reset flags
		setVisible(item !== undefined);
		setImgVisible(false);
		setLoaded(false);
	}, [item]);

	function videoFix() {
		setTimeout(() => setVideoVis(false), 200);
		if (item?.video_url && !item.video_url.includes('?tag=12')) item.video_url += '?tag=12';
		else if (item?.video_url) item.video_url = item.video_url.replace('?tag=12', '');
		setTimeout(() => setVideoVis(true), 500);
	}

	return (
		<div
			className={`${styles.container} ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
			onClick={onClick}
		>
			{item &&
				<div>
					{(!loaded || !imgVisible) && <SpinnerIcon className={styles.loader} />}
					{videoVis && item.type !== 'photo' && item.video_url ? (
						<video
							width={item.width}
							height={item.height}
							poster={item.url}
							playsInline
							autoPlay //this will fail on iOS if we have to fix the video and it has audio (safari blocks autoplay on unmuted videos)
							loop
							controls={loaded && item.type === 'video'} //don't show controls on gifs
							onClick={(e) => { if (item.type === 'video') e.stopPropagation() }} //prevent the popup from closing when clicking on a video (ignore for gif)
							onPlay={() => { if (!loaded || !imgVisible) setLoaded(true); setImgVisible(true) }}
							onLoadedData={(e) => { if (!loaded || !imgVisible) setLoaded(true); setImgVisible(true); }}
							onError={() => { if (isAppleTouchDevice()) videoFix(); }} //dummy fix for iOS issues
						>
							<source src={item.video_url} type='video/mp4' />
						</video>
					) : (
						<Image
							//src={galleryItem.url + '?name=orig'} //pull full size
							src={item.url + '?name=medium'}
							alt={item.alt_text || ''}
							width={item.width}
							height={item.height}
							//quality={100}
							unoptimized={true} //uses actual src rather than next/image (needs proxy to bypass adblockers)
							priority={true} //give priority to the modal image
							placeholder='empty'
							onLoadStart={() => setLoaded(false)}
							onLoadingComplete={() => setLoaded(true)}
							onTransitionEnd={() => setImgVisible(visible)}
							className={`${styles.image} ${loaded ? 'opacity-100' : 'opacity-0'}`}
						/>
					)}
				</div>
			}
		</div>
	)
}