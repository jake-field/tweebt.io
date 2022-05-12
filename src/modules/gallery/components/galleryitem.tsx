import Image from "next/image";
import { MouseEventHandler, useState } from "react";
import LoadingSpinner from "../../../common/components/loadingspinner";
import { GalleryItem } from "../types/gallery";

interface Props {
	item: GalleryItem;
	onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function GalleryMediaItem({ item, onClick }: Props) {
	const [loaded, setLoaded] = useState(false); //true when image loads
	const [imgVisible, setImgVisible] = useState(false); //true when image completes opacity animation

	return (
		<div className='flex flex-row items-center justify-center my-2 mx-1 shadow-lg' onClick={onClick}>
			{(!loaded || !imgVisible) &&
				<LoadingSpinner className={`absolute w-5 h-5 transition-opacity ease-in-out duration-300 ${loaded ? 'opacity-0' : 'opacity-100'}`} />
			}
			<Image
				src={item.srcimg}
				width={item.width}
				height={item.height}
				placeholder='empty'
				quality={75} //consider changing this, but this is acceptable for mosaic formatting
				onLoadingComplete={() => { setLoaded(true); setTimeout(() => setImgVisible(true), 300); }}
				className={`rounded-lg transition-opacity ease-in duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
			/>
		</div>
	);
}