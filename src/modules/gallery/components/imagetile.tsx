import styles from '../styles/tweet.module.css';
import { MouseEventHandler, useState } from 'react';
import SpinnerIcon from 'common/icons/spinnericon';
import { Media } from '../types/gallery.types';
import SpoilerOverlay from './spoileroverlay';
import { TileViewContext } from 'common/contexts/appsettings/view';
import { GifIcon, PlayCircleIcon } from '@heroicons/react/24/solid';
import MediaComponent from './mediacomponent';

interface Props {
	item: Media;
	onClick?: MouseEventHandler<any>;
	onHover?: MouseEventHandler<any>;
}

export default function ImageTile({ item, onClick, onHover }: Props) {
	const [loaded, setLoaded] = useState(false); //true when image loads
	const [imgVisible, setImgVisible] = useState(false); //true when image completes opacity animation
	const [hover, setHover] = useState(false);
	const touchScreenMode = window.matchMedia('(any-pointer: coarse)').matches;

	//On mobile, first click displays the overlay, second tap opens the popup
	//On any other device, clicking opens the popup since hover shows the overlay
	function handleClick(e: any) {
		if (touchScreenMode) {
			if (!hover) {
				setHover(true);
				if (onHover) onHover(e);
			}
			else if (onClick) onClick(e);
		} else {
			if (onClick) onClick(e);
		}
	}

	function handleHover(e: any, isHovering?: boolean) {
		if (touchScreenMode) {
			if (!isHovering) {
				setHover(false);
				if (onHover) onHover(isHovering ? e : undefined);
			}
			return;
		} else {
			setHover(isHovering || false);
			if (onHover) onHover(isHovering ? e : undefined);
		}
	}

	return (
		<div
			className={styles.tile}
			onMouseEnter={(e) => handleHover(e, true)}
			onMouseLeave={(e) => handleHover(e)}
			onClick={handleClick}
			draggable={false}
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
							{({ autoplayVideos, autoplayGifs }) =>
								<>
									{item.type === 'video' && !(hover && autoplayVideos) && <PlayCircleIcon className={styles.playbutton + ' rounded-full'} />}
									{item.type === 'animated_gif' && !autoplayGifs && <GifIcon className={styles.playbutton + ' rounded-2xl px-[6px]'} />}
								</>
							}
						</TileViewContext.Consumer>
					</span>
				}

				<a
					className=''
					href={item.video_url || item.url + '?name=orig'} //more control for mobile devices to serve the full image
					onClick={(e) => e.preventDefault()} //prevent navigating to the image itself
					draggable={false}
				>
					{item.type !== 'photo' ? ( //Two seperate paths here to reduce re-render potential of context changes on all tiles
						<TileViewContext.Consumer>
							{({ autoplayGifs, autoplayVideos, unmuteVideoOnHover }) =>
								<MediaComponent
									className={styles.video}
									item={item}
									loaded={loaded}
									visible={imgVisible}
									setLoaded={(e) => setLoaded(e)}
									setVisible={(e) => setImgVisible(e)}
									lowQuality
									muted={!(hover && unmuteVideoOnHover && item.type === 'video')}
									asImage={!autoplayGifs && item.type === 'animated_gif' || !autoplayVideos && item.type === 'video'}
								/>
							}
						</TileViewContext.Consumer>
					) : (
						<MediaComponent
							className={styles.image}
							item={item}
							loaded={loaded}
							visible={imgVisible}
							setLoaded={(e) => setLoaded(e)}
							setVisible={(e) => setImgVisible(e)}
							lowQuality
						/>
					)}
				</a>
			</span>
		</div >
	);
}