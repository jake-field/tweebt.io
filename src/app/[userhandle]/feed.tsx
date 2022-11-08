'use client';

import { signIn } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import Masonry from "react-masonry-css";
import { ResultsContext } from "../../common/contexts/appsettings/results";
import { SpinnerIcon } from "../../common/icons/spinnericon";
import ImagePopup from "../../modules/gallery/components/imagepopup";
import ImageTile from "../../modules/gallery/components/imagetile";
import Gallery, { Media } from "../../modules/gallery/types/gallery";
import { ProfileData } from "../../modules/profile/types/profile";

interface Props {
	profile: ProfileData;
}

//Mosaic settings, how columns are created/measured
const breakpointColumnsObj = {
	default: 5, //5 columns
	1700: 4,
	1100: 3,
	700: 2, //2 columns @ <700px width
};

export default function Feed({ profile }: Props) {
	const resultsContext = useContext(ResultsContext);
	const [gallery, setGallery] = useState<Gallery>();
	const [loading, setLoading] = useState(false);
	const [selectedGalleryItem, setSelectedGalleryItem] = useState<Media>();

	useEffect(() => {
		document.title = `${profile.name} (@${profile.handle}) // tweebt.io`; //TODO: fix for Next13 bug
		fetchData();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [profile]);

	//Check if there are more that can be fetched based on the next token
	function hasMore() {
		return (gallery?.meta?.next_token ? true : false);
	}

	//function for fetching data
	function fetchData() {
		//ignore request if already fetching, prevents double ups/unwanted requests
		if (loading) return;
		setLoading(true);

		let pagination = gallery?.meta.next_token ? `&next=${gallery.meta.next_token}` : '';

		let target = resultsContext.profileOptions;
		let merge: string[] = [];
		if (target.replies === false) merge.push('replies');
		if (target.retweets === false || profile?.protected) merge.push('retweets');
		let exclude = merge.length ? '&exclude=' + merge.join(',') : '';

		console.log('fetch',`/api/user/${profile.id}?max_results=100${pagination}${exclude}`,`[${gallery?.items.length || 0} item(s)]`);
		fetch(`/api/user/${profile.id}?max_results=100${pagination}${exclude}`)
			.then((res) => {
				if (res.status === 401) {
					signIn('twitter');
					throw 'Lost session, forcing sign-in';
				}
				return res.json();
			})
			.then((data: Gallery) => {
				//store for items or if the meta was fully recieved
				//storing for meta helps prevent re-requesting empty results
				if ((data.items && data.items.length > 0) || data.meta) {
					const newGallery: Gallery = {
						items: gallery?.items ? [...gallery?.items, ...data.items] : [...data.items],
						error: data.error || gallery?.error, //use newest error?
						meta: {
							result_count: (gallery?.meta.result_count || 0) + data.meta.result_count,
							newest_id: gallery?.meta.newest_id || data.meta.newest_id, //take newest from original gallery first
							oldest_id: data.meta.oldest_id, //always take oldest from newest request
							next_token: data.meta.next_token, //only use current next token
							previous_token: gallery?.meta.previous_token || data.meta.previous_token, //should take oldest prev token
						}
					};

					//apply new gallery
					setGallery(newGallery);
				} else {
					console.log('GalleryFeed(): ', 'fetchData(): ', 'fetch failed, api did not return either items or metadata');
				}
			}).finally(() => {
				setLoading(false);
			}).catch(err => {
				console.log('GalleryFeed(): ', 'fetchData(): ', 'fetch failed with error: ', err);
			});
	}

	return (
		<div className='flex flex-col items-center w-full text-center sm:px-3 md:px-3'>
			<ImagePopup item={selectedGalleryItem} onClick={() => setSelectedGalleryItem(undefined)} />

			<InfiniteScroll
				className='w-full max-w-[2500px]'
				initialLoad={false} //even when true this doesn't seem to fire, set false just incase this changes
				loadMore={fetchData}
				hasMore={hasMore()}
				threshold={2500} //so high due to react-masonry-css having heavily unbalanced columns, this helps hide the troughs
			>
				<Masonry breakpointCols={breakpointColumnsObj} className='flex w-auto'>
					{gallery && gallery.items.map((item, index) => (
						<ImageTile key={index} item={item} onClick={() => setSelectedGalleryItem(item)} />
					))}
				</Masonry>
			</InfiniteScroll>

			{(gallery && !hasMore()) && !loading ? (
				<div className='flex flex-row items-center justify-center h-48 text-gray-600 dark:text-gray-400'>
					{gallery?.error ? `[${gallery?.error?.title} - ${gallery?.error?.detail}]` : gallery?.items.length === 0 ? 'Nothing but crickets...' : "You've gone as far back as I can show!"}
				</div>
			) : (
				<div key='loader' className='flex flex-row items-center justify-center h-48'>
					<SpinnerIcon className='w-10 h-10' />
				</div>
			)}
		</div>
	)
}