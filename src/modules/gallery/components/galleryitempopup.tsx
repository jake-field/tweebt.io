import { XCircleIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import { MouseEventHandler, useEffect, useState } from 'react';
import { SpinnerIcon } from '../../../common/icons/spinnericon';
import { Media } from '../types/gallery';

interface Props {
	galleryItem?: Media;
	visible: boolean;
	onClick: MouseEventHandler<HTMLDivElement>;
}

export default function GalleryItemPopup({ galleryItem, visible, onClick }: Props) {
	const [loaded, setLoaded] = useState(false);
	const [videoVis, setVideoVis] = useState(true);
	const [imgVisible, setImgVisible] = useState(false); //true when image completes opacity animation

	//testing for video fixes
	const isAppleTouchDevice = /iPhone|iPad|iPod/gi.test(navigator.userAgent) || (/AppleWebKit/gi.test(navigator.userAgent) && navigator.maxTouchPoints > 0);

	//when galleryItem changes, force loaded to false so we get the loading indicator
	useEffect(() => {
		setImgVisible(false);
		setLoaded(false);
	}, [galleryItem]);

	function videoFix() {
		setTimeout(() => setVideoVis(false), 200);
		if (galleryItem?.video_url && !galleryItem.video_url.includes('?tag=12')) galleryItem.video_url += '?tag=12';
		else if (galleryItem?.video_url) galleryItem.video_url = galleryItem.video_url.replace('?tag=12', '');
		setTimeout(() => setVideoVis(true), 500);
	}

	//don't render if no item
	if (!galleryItem) return null;

	return (
		<div
			className={`select-none flex flex-row justify-center items-center w-full h-full fixed top-0 left-0 bg-black z-50 bg-opacity-80 backdrop-blur transition-opacity ease-in-out duration-150 ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
			onClick={onClick}
		>
			<div className='flex flex-col justify-center items-center max-w-[95vw] max-h-[80vh] md:max-h-[90vh] h-auto w-auto'>
				{(!loaded || !imgVisible) && <SpinnerIcon className='absolute w-10 h-10 text-white' />}

				<span className='relative h-0 w-full bottom-8' title='Close'>
					<XCircleIcon className='absolute right-0 w-7 hover:text-red-400 text-gray-400 cursor-pointer' />
				</span>

				{videoVis && visible && galleryItem.type !== 'photo' && galleryItem.video_url ? (
					<video
						className='max-h-[80vh] md:max-h-[90vh] w-auto'
						width={galleryItem.width}
						height={galleryItem.height}
						poster={galleryItem.url}
						playsInline
						autoPlay //this will fail on iOS if we have to fix the video and it has audio (safari blocks autoplay on unmuted videos)
						loop
						controls={loaded && galleryItem.type === 'video'} //don't show controls on gifs
						onClick={(e) => { if (galleryItem.type === 'video') e.stopPropagation() }} //prevent the popup from closing when clicking on a video (ignore for gif)
						onPlay={() => { if (!loaded || !imgVisible) setLoaded(true); setImgVisible(true) }}
						onLoadedData={(e) => { if (!loaded || !imgVisible) setLoaded(true); setImgVisible(true); }}
						onError={() => { if (isAppleTouchDevice) videoFix(); }} //dummy fix for iOS issues
					>
						<source src={galleryItem.video_url} type='video/mp4' />
					</video>
				) : visible && (
					<Image
						//src={galleryItem.url + '?name=orig'} //pull full size
						src={galleryItem.url + '?name=medium'}
						alt={galleryItem.alt_text}
						width={galleryItem.width}
						height={galleryItem.height}
						//quality={100}
						unoptimized={true} //uses actual src rather than next/image (needs proxy to bypass adblockers)
						priority={true} //give priority to the modal image
						placeholder='empty'
						onLoadStart={() => setLoaded(false)}
						onLoadingComplete={() => setLoaded(true)}
						onTransitionEnd={() => setImgVisible(visible)}
						className={`object-scale-down shadow-lg transition-opacity ease-in-out duration-150 ${loaded ? 'opacity-100' : 'opacity-0'}`}
					/>
				)}
			</div>
		</div>
	)
}