import Image from "next/image";
import { MouseEvent, useState } from "react";
import Placeholder from "../../modules/gallery/components/placeholder";
import { GalleryItem } from "../../modules/gallery/types/gallery";

interface Props {
	galleryItem: GalleryItem;
}

export default function Modal({ galleryItem }: Props) {
	const [loaded, setLoaded] = useState(false);

	function OpenInNewWindow(e: MouseEvent<HTMLImageElement>) {
		if (e.button === 1) {
			e.preventDefault();
			window.open(galleryItem.srcimg, '_blank');
			return true;
		}

		return false;
	}

	return (
		<div className='flex flex-row justify-center items-center w-full h-full fixed top-0 left-0 bg-black z-50 bg-opacity-50'>
			<div className='flex h-[95vh] max-w-[95vw]'>
				{!loaded && <Placeholder />}
				<Image
					src={galleryItem.srcimg}
					width={galleryItem.width}
					height={galleryItem.height}
					placeholder='empty'
					className='object-contain'
					onLoadStart={() => setLoaded(false)}
					onLoadingComplete={() => setLoaded(true)}
					onAuxClick={(e) => OpenInNewWindow(e)}
				/>
			</div>
		</div>
	)
}