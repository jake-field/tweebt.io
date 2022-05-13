import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroller"
import Masonry from "react-masonry-css"
import ImagePopup from "../../../common/components/imagepopup"
import LoadingSpinner from "../../../common/components/loadingspinner"
import Profile from "../../../common/types/profile"
import { Gallery, GalleryItem } from "../types/gallery"
import GalleryMediaItem from "./galleryitem"

interface Props {
	profile?: Profile;
}

const breakpointColumnsObj = {
	default: 5,
	1700: 4,
	1100: 3,
	700: 2,
};

export default function GalleryComponent({ profile }: Props) {
	const [currentUser, setCurrentUser] = useState<Profile | null>(null);
	const [galleries, setGalleries] = useState<Gallery[] | null>(null);
	const [selectedGalleryItem, setSelectedGalleryItem] = useState<GalleryItem | null>(null);
	const [modalVisible, setModalVisible] = useState(true);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!profile) return;
		setLoading(true);
		setCurrentUser(profile);
		fetch(`api/${profile.id}`)
			.then((res) => res.json())
			.then((data) => {
				setGalleries([data]);
				setLoading(false);
			});
	}, [profile, setGalleries, setLoading]);

	async function fetchData(page: number) {
		if (!profile) return null;

		const url = `api/${profile.id}`;
		const pagination = galleries ? `?next=${galleries[galleries.length - 1].pagination?.next_token}` : '';

		await fetch(page > 0 ? url + pagination : url)
			.then((res) => res.json())
			.then((data) => {
				if (profile.id === currentUser?.id) {
					setGalleries([...galleries!, data]);
				} else {
					setGalleries([data]);
					setCurrentUser(profile);
				}
			});
	}

	function hasMore(): boolean {
		return !galleries || galleries && galleries[galleries.length - 1].pagination?.next_token !== undefined || false;
	}

	function openImageModal(item: GalleryItem) {
		document.body.style.overflowY = 'hidden';
		document.body.style.backgroundColor = 'black'; //TODO: maybe remove htis if it doesn't work
		setSelectedGalleryItem(item);
		setModalVisible(true);
	}

	function closeImageModal() {
		document.body.style.overflowY = '';
		document.body.style.backgroundColor = ''; //TODO: maybe remove htis if it doesn't work
		setModalVisible(false);
	}

	return (
		<>
			{galleries && galleries[0].error ? (
				<p>{galleries[0].error}</p>
			) : !galleries ? (
				<p>Loading Tweets...</p>
			) : (
				null
			)}

			{galleries && galleries[0].tweetMedia.length > 0 &&
				<>
					{selectedGalleryItem !== null && <ImagePopup galleryItem={selectedGalleryItem} visible={modalVisible} onClick={() => closeImageModal()} />}
					<InfiniteScroll
						className='w-fit max-w-[2500px] select-none'
						initialLoad={false}
						loadMore={fetchData}
						hasMore={hasMore()}
						threshold={1000} //so high due to react-masonry-css having heavily unbalanced columns
						loader={<div key={0} className='flex flex-row items-center justify-center '><LoadingSpinner className='w-10 h-10' /></div>}
					>
						<Masonry
							breakpointCols={breakpointColumnsObj}
							className='flex w-auto'
							columnClassName=''
						>
							{galleries ? (
								galleries.map(gallery => {
									return gallery.tweetMedia.map(item => {
										return <GalleryMediaItem key={item.media_key} item={item} onClick={() => openImageModal(item)} />
									})
								})
							) : (
								<p>Nothing to see here</p>
							)}
						</Masonry>
					</InfiniteScroll>
				</>

			}
		</>
	)
}