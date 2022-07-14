import Image from "next/image";
import { MouseEventHandler, useEffect, useState } from "react";
import { Media } from "../../modules/shared/types/gallery";
import LoadingSpinner from "./loadingspinner";

interface Props {
	galleryItem: Media;
	visible: boolean;
	onClick: MouseEventHandler<HTMLDivElement>;
}

export default function ImagePopup({ galleryItem, visible, onClick }: Props) {
	const [loaded, setLoaded] = useState(false);
	const [imgVisible, setImgVisible] = useState(false); //true when image completes opacity animation
	const [modalVisible, setModalVisible] = useState(false);
	const [fade, setFade] = useState(false);

	//when galleryItem changes, force loaded to false so we get the loading indicator
	useEffect(() => {
		setImgVisible(false);
		setLoaded(false);
	}, [galleryItem]);

	//fading assistance
	useEffect(() => {
		if (visible) {
			setModalVisible(true);
			setTimeout(() => setFade(true), 20); //give time for display:flex to kick in to allow animations
		}
		else {
			setFade(false);
		}
	}, [visible]);

	return (
		<div style={{ display: modalVisible ? 'flex' : 'none' }}>
			<div
				className='select-none flex flex-row justify-center items-center w-full h-full fixed top-0 left-0 bg-black z-50 bg-opacity-80 backdrop-blur transition-opacity ease-in-out duration-150'
				onClick={onClick}
				style={{ opacity: fade ? '100' : '0' }}
				onTransitionEnd={() => { if (!visible) setModalVisible(false); }}
			>
				<div className='flex flex-col justify-center items-center h-[95vh] max-w-[95vw]'>
					{(!loaded || !imgVisible) && <LoadingSpinner className='absolute w-10 h-10 text-white' />}
					<Image
						id='modalImg'
						src={galleryItem.url + '?name=orig'} //pull full size
						width={galleryItem.width}
						height={galleryItem.height}
						quality={100}
						//unoptimized={true} //uses actual src rather than next/image (this may cause issues with adblockers)
						priority={true} //give priority to the modal image
						placeholder='empty'
						onLoadStart={() => setLoaded(false)}
						onLoadingComplete={() => setLoaded(true)}
						onTransitionEnd={() => setImgVisible(visible)}
						className={`object-contain shadow-lg transition-opacity ease-in-out duration-150 ${loaded ? 'opacity-100' : 'opacity-0'}`}
					/>
				</div>
			</div>
		</div>

	)
}