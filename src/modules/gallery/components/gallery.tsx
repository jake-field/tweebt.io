import { useEffect, useState } from "react";
import Masonry from "react-masonry-css"
import GalleryItemPopup from "./galleryitempopup";
import Gallery, { Media } from "../../shared/types/gallery";
import GalleryMediaItem from "./galleryitem"
import InfiniteScroll from "react-infinite-scroller";
import { useRouter } from "next/router";

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
	const router = useRouter();
	const [selectedGalleryItem, setSelectedGalleryItem] = useState<Media>();
	const [modalVisible, setModalVisible] = useState(false);

	function updateImagePopup(item?: Media) {
		document.body.style.overflowY = item ? 'hidden' : '';
		document.body.style.backgroundColor = item ? 'black' : '';
		if (item) setSelectedGalleryItem(item); //don't update state if null as it removes the fade-out effect on modal close
		setModalVisible(!!item);
	}

	//temp
	// useEffect(() => {
	// 	console.log('gallerycomponent:gallery[] updated');
	// }, [gallery]);

	//back button hijacking for allowing the modal to register as a separate history item
	useEffect(() => {
		if (modalVisible) {
			router.beforePopState(() => {
				console.log('modalpop')
				router.beforePopState(() => true); //reset
				updateImagePopup();
				return true;
			});
		} else {
			router.beforePopState(() => true);
		}
	}, [router, modalVisible]);

	if (gallery.length === 0 || gallery[0].items.length === 0) return null;

	return (
		<div className="flex flex-col items-center w-full sm:px-3 text-center md:px-20 select-none">
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
							<GalleryMediaItem key={index} item={item} onClick={() => updateImagePopup(item)} />
						))
					))}
				</Masonry>
			</InfiniteScroll>
		</div>
	)
}