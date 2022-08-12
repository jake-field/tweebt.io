import { useState } from 'react';
import Masonry from 'react-masonry-css'
import GalleryItemPopup from './galleryitempopup';
import Gallery, { Media } from '../types/gallery';
import GalleryMediaItem from './galleryitem'
import InfiniteScroll from 'react-infinite-scroller';

interface Props {
	gallery: Gallery[];

	loadNext: () => void;
	canLoadMore: () => boolean;
}

//Mosaic settings, how columns are created/measured
const breakpointColumnsObj = {
	default: 5, //5 columns
	1700: 4,
	1100: 3,
	700: 2, //2 columns @ <700px width
};

export default function GalleryComponent({ gallery, loadNext, canLoadMore }: Props) {
	const [selectedGalleryItem, setSelectedGalleryItem] = useState<Media>();
	const [modalVisible, setModalVisible] = useState(false);

	function updateImagePopup(item?: Media) {
		//hide scrollbars on open, force fixed for the sake of mobile, then restore scroll on close
		const scroll = document.body.style.top;
		const s = -(scrollY).toString();
		document.body.style.overflowY = item ? 'hidden' : '';
		document.body.style.position = item ? 'fixed' : '';
		document.body.style.top = item ? `${s}px` : '';
		document.body.style.width = item ? '100%' : '';

		if (!item) {
			const num = Number(scroll.substring(0,scroll.indexOf('px')));
			scrollTo({ top: -num });
		}

		//if on mobile, make the background black so that the device browser has consistent banner colors
		if (window.matchMedia('(pointer: coarse)').matches) document.body.style.backgroundColor = item ? 'black' : '';

		//don't update state if null as it removes the fade-out effect on modal close
		if (item) setSelectedGalleryItem(item);
		setModalVisible(!!item);
	}

	//back button hijacking for allowing the modal to register as a separate history item
	// useEffect(() => {
	// 	if (modalVisible) {
	// 		router.beforePopState(() => {
	// 			router.beforePopState(() => true); //reset
	// 			updateImagePopup();
	// 			return true;
	// 		});
	// 	} else {
	// 		router.beforePopState(() => true);
	// 	}
	// }, [router, modalVisible]);

	if (gallery.length === 0 || gallery[0].items.length === 0) return null;

	return (
		<div className='flex flex-col items-center w-full select-none'>
			<GalleryItemPopup
				galleryItem={selectedGalleryItem}
				visible={modalVisible}
				onClick={() => updateImagePopup()}
			/>

			<InfiniteScroll
				className='w-full max-w-[2500px]'
				initialLoad={false}
				loadMore={loadNext}
				hasMore={canLoadMore()}
				threshold={1000} //so high due to react-masonry-css having heavily unbalanced columns, this helps hide the troughs
			>
				<Masonry breakpointCols={breakpointColumnsObj} className='flex w-auto' columnClassName=''>
					{gallery.map(listing => (
						listing.items.map((item, index) => (
							<GalleryMediaItem 
								key={index}
								item={item}
								onClick={() => updateImagePopup(item)}
							/>
						))
					))}
				</Masonry>
			</InfiniteScroll>
		</div>
	)
}