import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import InfiniteScroll from "react-infinite-scroller"
import Masonry from "react-masonry-css"
import ImagePopup from "../../../common/components/imagepopup"
import LoadingSpinner from "../../../common/components/loadingspinner"
import Profile, { ProfileMedia, ProfileMediaItem } from "../../../common/types/profile"
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
	const router = useRouter();
	let [gallery, setGallery] = useState<ProfileMedia | null>(null);
	const [selectedGalleryItem, setSelectedGalleryItem] = useState<ProfileMediaItem | null>(null);
	const [modalVisible, setModalVisible] = useState(true);
	const [loading, setLoading] = useState(false);
	const [forceFetch, setForceFetch] = useState(false);

	//profile change
	useEffect(() => {
		setLoading(true);
		closeImageModal(); //close modal on profile change
		gallery = null;
		setGallery(null);
		fetchData(0);
	}, [profile]);

	useEffect(() => {
		if(gallery?.items&& gallery?.items.length < 10 && gallery?.items.length > 0 && hasMore()) {
			console.log('early fetch to fill space')
			fetchData(1)
		}
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

	useEffect(() => {
		if (gallery) {
			if (router.query['t']) {
				console.log(router.query['t']);
				const item = gallery?.items.find(t => t.tweetid === router.query['t']);
				if (item && (item !== selectedGalleryItem || !modalVisible)) {
					console.log(item);
					openImageModal(item);
				}
			}
		}
	}, [gallery, router]);

	function fetchData(page: number) {
		setLoading(true);

		//if there is a profile, as well as either a pagination token or no items were pre-fetched
		if (profile && ((gallery?.pagination?.token || !forceFetch) || !gallery?.items)) {
			//use normal pagination but if we don't get good results, force fetch based on oldest tweet ID
			//this usually fixes large gaps in timeline history as well, producing more results, but we should only do it once
			let pagination = '';
			if (page > 0) {
				if (gallery?.pagination?.token) {
					pagination = '?next=' + gallery.pagination.token;
					setForceFetch(false); //allow ourselves to force fetch again if we've been fetching normally
				} else if (!forceFetch && gallery?.pagination?.oldest_id) {
					pagination = '?until=' + gallery.pagination.oldest_id;
					setForceFetch(true); //disallow future force fetching unless cleared by a pagination token
				}
			}

			fetch(`api/${profile.id}${pagination}`)
				.then((res) => res.json())
				.then((data) => {
					if (gallery?.items && data?.media?.items) {
						setGallery({ items: [...gallery.items, ...data.media.items], pagination: data.media.pagination });
					} else if (data?.media?.items) {
						setGallery(data.media);
					}
				}).finally(() => {
					setLoading(false);
				});
		}
	}

	function hasMore() {
		return !loading && (gallery?.pagination?.token !== undefined || !forceFetch);
	}

	function openImageModal(item: ProfileMediaItem) {
		document.body.style.overflowY = 'hidden';
		document.body.style.backgroundColor = 'black';
		setSelectedGalleryItem(item);
		setModalVisible(true);
		//router.push('/@' + profile?.handle + `?t=${item.tweetid}`, undefined, { scroll: false, shallow: true });
	}

	function closeImageModal() {
		document.body.style.overflowY = '';
		document.body.style.backgroundColor = '';
		//setSelectedGalleryItem(null); //we do not do this here as it removes the fade-out effect
		setModalVisible(false);

		//TODO: consider using a shallow movement here, using router.back()
		//router.push('/@' + profile?.handle, undefined, { scroll: false, shallow: true });
	}

	return (
		<>
			{selectedGalleryItem !== null &&
				<ImagePopup
					galleryItem={selectedGalleryItem}
					visible={modalVisible}
					onClick={() => closeImageModal()}
				/>
			}

			{gallery?.items &&
				<div className='w-full flex justify-end pr-1'>
					<small>{gallery?.items.length}{hasMore() ? '+' : ''} Result{gallery?.items.length > 1 ? 's' : ''}</small>
				</div>
			}

			<InfiniteScroll
				className='w-fit max-w-[2500px] select-none mb-40'
				initialLoad={false}
				loadMore={fetchData}
				hasMore={hasMore()}
				threshold={1000} //so high due to react-masonry-css having heavily unbalanced columns, this helps hide the troughs
			>
				{gallery?.items ? (
					<>
						<Masonry
							breakpointCols={breakpointColumnsObj}
							className='flex w-auto'
							columnClassName=''
						>
							{
								gallery.items.map((item, index) => {
									return <GalleryMediaItem key={index} item={item} onClick={() => openImageModal(item)} />
								})
							}
						</Masonry>
						{loading && <div key={0} className='flex flex-row items-center justify-center my-28'><LoadingSpinner className='w-10 h-10' /></div>}
					</>
				) : (
					<div key={0} className='flex flex-row items-center justify-center'><LoadingSpinner className='w-10 h-10' /></div>
				)}

			</InfiniteScroll>
		</>
	)
}