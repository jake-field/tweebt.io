import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Masonry from "react-masonry-css"
import ImagePopup from "../../../common/components/imagepopup";
import Gallery, { Media } from "../../shared/types/gallery";
import GalleryMediaItem from "./galleryitem"

interface Props {
	gallery: Gallery[];
}

const breakpointColumnsObj = {
	default: 5,
	1700: 4,
	1100: 3,
	700: 2,
};

export default function GalleryNewComponent({ gallery }: Props) {
	const router = useRouter();
	const [selectedGalleryItem, setSelectedGalleryItem] = useState<Media>();
	const [modalVisible, setModalVisible] = useState(false);

	useEffect(() => {
		console.log('updated');
	}, [gallery]);

	//back button hijacking for allowing the modal to register as a separate history item
	useEffect(() => {
		if (modalVisible) {
			router.beforePopState(() => {
				console.log('modalpop')
				router.beforePopState(() => true); //reset
				closeImageModal();
				return false;
			});
		} else {
			router.beforePopState(() => true);
		}
	}, [router, modalVisible]);

	if (gallery.length === 0 || gallery[0].items.length === 0) return null;

	function openImageModal(item: Media) {
		console.log('modal open')
		document.body.style.overflowY = 'hidden';
		document.body.style.backgroundColor = 'black';
		setSelectedGalleryItem(item);
		setModalVisible(true);
	}

	function closeImageModal() {
		console.log('modal clase')
		document.body.style.overflowY = '';
		document.body.style.backgroundColor = '';
		//setSelectedGalleryItem(null); //we do not do this here as it removes the fade-out effect
		setModalVisible(false);
	}

	return (
		<>
			{selectedGalleryItem &&
				<ImagePopup
					galleryItem={selectedGalleryItem}
					visible={modalVisible}
					onClick={() => closeImageModal()}
				/>
			}

			<Masonry breakpointCols={breakpointColumnsObj} className='flex w-auto' columnClassName=''>
				{gallery.map(listing => {
					return listing.items.map((item, index) => {
						return <GalleryMediaItem key={index} item={item} onClick={() => openImageModal(item)} />
					})
				})}
			</Masonry>
		</>
	)
}