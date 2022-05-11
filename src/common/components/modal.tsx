import Image from "next/image";
import { MouseEvent, useState } from "react";
import { GalleryItem } from "../../modules/gallery/types/gallery";
import LoadingSpinner from "./loadingspinner";

interface Props {
	galleryItem: GalleryItem;
}

export default function Modal({ galleryItem }: Props) {
	const [loaded, setLoaded] = useState(false);

	function OpenInNewWindow(e: MouseEvent<HTMLDivElement>) {
		console.log('hello');
		if (e.button === 1) {
			e.preventDefault();
			window.open(galleryItem.srcimg, '_blank');
			return true;
		}

		return false;
	}

	return (
		<div className='flex flex-row justify-center items-center w-full h-full fixed top-0 left-0 bg-black z-50 bg-opacity-50'>
			<div className='flex flex-col justify-center items-center h-[95vh] max-w-[95vw]'>
				{!loaded && <LoadingSpinner className='absolute w-10 h-10' />}
				<Image
					src={galleryItem.srcimg}
					width={galleryItem.width}
					height={galleryItem.height}
					quality={100}
					//unoptimized={true}
					placeholder='empty'
					onLoadStart={() => setLoaded(false)}
					onLoadingComplete={() => setLoaded(true)}
					onAuxClick={(e) => OpenInNewWindow(e)}
					className={`object-contain shadow-lg transition-opacity ease-in duration-100 ${loaded ? 'opacity-100' : 'opacity-0'}`}
				/>
			</div>
		</div>
	)
}