import Image from "next/image";
import React from "react";
import { Media } from "../types/gallery.types";

interface Props {
	className?: string;

	item: Media;
	loaded: boolean;
	visible: boolean;
	setLoaded: (v: boolean) => void;
	setVisible: (v: boolean) => void;
	onClick?: (e: any) => void;

	muted?: boolean;
	asImage?: boolean;
	lowQuality?: boolean;
}

export default function MediaComponent({ className, item, loaded, visible, setLoaded, setVisible, onClick, muted, asImage, lowQuality }: Props) {
	const srcA = lowQuality ? item.videolq_url : item.video_url;
	const srcB = lowQuality ? item.video_url : item.videolq_url;

	//Block clicks on the video player, but only if it's a video. Gifs act like images
	function defaultClickHandler(e: any) {
		if (item.type === 'video') e.stopPropagation();
	}

	return (
		<>
			{item.type === 'photo' || asImage ? (
				<Image
					className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'}`}
					src={`${item.url}?name=${lowQuality ? 'small' : 'medium'}`}
					width={item.width}
					height={item.height}
					alt={item.alt_text || item.tweet.text || ''}
					placeholder='empty'
					//quality={75} //consider changing this, but this is acceptable for mosaic formatting
					unoptimized={true} //save server processing stress
					priority={!lowQuality}
					onLoadingComplete={() => setLoaded(true)}
					onTransitionEnd={() => setVisible(true)}
					onClick={onClick}
					draggable={false}
				/>
			) : (
				<video
					className={className}
					width={item.width}
					height={item.height}
					poster={item.url}
					draggable={false}
					muted={muted}
					playsInline
					autoPlay={item.type === 'animated_gif'}
					loop
					preload='auto'
					controls={loaded && item.type === 'video' && !lowQuality} //don't show controls on gifs
					onClick={onClick ? onClick : defaultClickHandler} //prevent the popup from closing when clicking on a video (ignore for gif)
					//onPlay={() => { if (!loaded || !visible) { setLoaded(true); setVisible(true); } }}
					onLoadedData={(e) => { if (!loaded || !visible) { setLoaded(true); setVisible(true); e.currentTarget.play(); } }}
					onTransitionEnd={() => setVisible(true)}
				>
					{srcA && //load first
						<>
							<source src={srcA} type='video/mp4' />
							<source src={srcA + '?tag=12'} type='video/mp4' /> {/* Twitter video tagging system */}
							<source src={srcA + `#t=0,${Math.round(item.duration_ms! / 1000)}`} type='video/mp4' /> {/* Try force start and length */}
							{item.type === 'video' && <source src={srcA + `?rnd=${Math.round(Math.random() * 1000)}`} type='video/mp4' />} {/* Fallback to non-cached */}
						</>
					}
					{srcB && //fallback
						<>
							<source src={srcB} type='video/mp4' />
							<source src={srcB + '?tag=12'} type='video/mp4' /> {/* Twitter video tagging system */}
							<source src={srcB + `#t=0,${Math.round(item.duration_ms! / 1000)}`} type='video/mp4' /> {/* Try force start and length */}
							{item.type === 'video' && <source src={srcB + `?rnd=${Math.round(Math.random() * 1000)}`} type='video/mp4' />} {/* Fallback to non-cached */}
						</>
					}
				</video>
			)}
		</>
	)
}