import Image from "next/image";
import { useState } from "react";
import LoadingSpinner from "../../../common/components/loadingspinner";
import Modal from "../../../common/components/modal";
import { GalleryItem } from "../types/gallery";

interface Props {
	item: GalleryItem;
}

export default function GalleryMediaItem({ item }: Props) {
	const [imageOpen, setImageOpen] = useState(false);
	const [loaded, setLoaded] = useState(false);

	return (
		<div className='my-2 mx-1 shadow-lg flex flex-row items-center justify-center' onClick={() => setImageOpen(!imageOpen)}>
			{imageOpen && <Modal galleryItem={item} />}
			<LoadingSpinner className={`absolute w-5 h-5 transition-opacity ease-in-out rounded-lg duration-300 ${!loaded ? 'opacity-100' : 'opacity-0'}`} />

			<Image
				src={item.srcimg}
				width={item.width}
				height={item.height}
				placeholder='empty'
				quality={75} //consider changing this, but this is acceptable for mosaic formatting
				onLoadingComplete={() => setLoaded(true)}
				className={`transition-opacity ease-in rounded-lg duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
			/>
		</div>
	);
}