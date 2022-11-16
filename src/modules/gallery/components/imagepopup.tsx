import styles from '../styles/popup.module.css';
import { MouseEventHandler, useEffect, useState } from 'react';
import SpinnerIcon from '../../../common/icons/spinnericon';
import { Media } from '../types/gallery.types';
import MediaComponent from './mediacomponent';

interface Props {
	item?: Media;
	onClick: MouseEventHandler<HTMLDivElement>;
}

export default function ImagePopup({ item, onClick }: Props) {
	const [loaded, setLoaded] = useState(false);
	const [visible, setVisible] = useState(false);
	const [imgVisible, setImgVisible] = useState(false); //true when image completes opacity animation

	//when galleryItem changes, force loaded to false so we get the loading indicator
	useEffect(() => {
		//Reset flags
		setImgVisible(false);
		setLoaded(false);
		setVisible(item !== undefined);
	}, [item]);

	useEffect(() => {
		//hide scrollbars on open, force fixed for the sake of mobile, then restore scroll on close
		const scroll = document.body.style.top;
		const s = -(scrollY).toString();
		document.body.style.overflowY = visible ? 'hidden' : '';
		document.body.style.position = visible ? 'fixed' : '';
		document.body.style.top = visible ? `${s}px` : '';
		document.body.style.width = visible ? '100%' : '';

		if (!visible) {
			const num = Number(scroll.substring(0, scroll.indexOf('px')));
			scrollTo({ top: -num });
		}

		//if on mobile, make the background black so that the device browser has consistent ui colors
		if (window.matchMedia('(pointer: coarse)').matches) document.body.style.backgroundColor = item ? 'black' : '';
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible]);

	return (
		<div className={`${styles.container} ${visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} onClick={onClick}>
			{item &&
				<div>
					{(!loaded || !imgVisible) && <SpinnerIcon className={styles.loader} />}
					<MediaComponent
						item={item}
						className={item.type === 'photo' ? styles.image : ''}
						loaded={loaded}
						visible={imgVisible}
						setLoaded={setLoaded}
						setVisible={setImgVisible}
						asImage={!visible} //force poster image if popup not visible
					/>
				</div>
			}
		</div>
	)
}