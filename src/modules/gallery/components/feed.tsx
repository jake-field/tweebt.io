'use client';

import { useContext, useEffect, useState } from "react";
import { ResultsContext } from "../../../common/contexts/appsettings/results";
import getGallery, { GalleryParams } from "..";
import Gallery from "../types/gallery";
import { ProfileData } from "../../profile/types/profile";
import { Media } from "../types/gallery.types";
import ImagePopup from "./imagepopup";
import InfiniteScroll from "react-infinite-scroller";
import Masonry from "react-masonry-css";
import ImageTile from "./imagetile";
import SpinnerIcon from "../../../common/icons/spinnericon";
import { usePathname } from "next/navigation";

interface Props {
	profile?: ProfileData;
	searchQuery?: string;
	maxResults?: number;
	demo?: boolean;
}

//Mosaic settings, how columns are created/measured
const breakpointColumnsObj = {
	default: 5, //5 columns
	1700: 4,
	1100: 3,
	700: 2, //2 columns @ <700px width
}

export default function Feed({ profile, searchQuery, maxResults, demo }: Props) {
	const pathname = usePathname();
	const resultsContext = useContext(ResultsContext);
	const [loading, setLoading] = useState(false);
	const [gallery, setGallery] = useState<Gallery>();
	const [selectedGalleryItem, setSelectedGalleryItem] = useState<Media>();

	//Fetch gallery data on profile/search update, also update title as per Next13 head.tsx bug
	useEffect(() => {
		//TODO: fix for Next13 bug (pathname check for root demo)
		if (searchQuery) document.title = `${searchQuery} // tweebt.io`;
		if (profile && pathname !== '/') document.title = `${profile.name} (@${profile.handle}) // tweebt.io`;
		else if (pathname === '/') document.title = 'tweebt.io';

		//force a gallery wipe if searching
		fetchData(0, searchQuery !== undefined);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [profile, searchQuery]);

	//function for fetching data
	function fetchData(page?: number, wipe?: boolean) {
		if (gallery !== undefined && demo) return; //ignore extra loads if running demo

		//ignore request if already fetching, prevents double ups/unwanted requests
		if (!loading) setLoading(true); else return;

		const endpoint = '/api' + (profile ? `/user/${profile.id}` : searchQuery ? `/search` : `/feed`);
		let params: GalleryParams = {
			max_results: maxResults || 100
		};

		const opt = (profile ? resultsContext.profileOptions : !searchQuery ? resultsContext.feedOptions : undefined);
		const showRetweets = opt ? opt.retweets && !profile?.protected : false;
		const showReplies = opt ? opt.replies : false;

		if (!showReplies || !showRetweets) {
			params.exclude = [];
			!showRetweets && params.exclude.push('retweets');
			!showReplies && params.exclude.push('replies');
		}

		if (gallery?.meta.next_token) params.next = gallery?.meta.next_token;
		if (searchQuery) params.q = searchQuery;

		getGallery(endpoint, params, setGallery, !wipe ? gallery : undefined)
			.catch((err) => console.warn(err))
			.finally(() => setLoading(false));
	}

	//Check if there are more that can be fetched based on the next token
	function hasMore() {
		return (gallery?.meta?.next_token && !demo ? true : false);
	}

	return (
		<div className='flex flex-col items-center w-full text-center sm:px-3 md:px-3'>
			{gallery && <ImagePopup item={selectedGalleryItem} onClick={() => setSelectedGalleryItem(undefined)} />}

			<InfiniteScroll
				className='w-full max-w-[2500px]'
				initialLoad={false} //even when true this doesn't seem to fire, set false just incase this changes
				loadMore={fetchData}
				hasMore={hasMore()}
				threshold={2500} //so high due to react-masonry-css having heavily unbalanced columns, this helps hide the troughs
			>
				<Masonry breakpointCols={breakpointColumnsObj} className='flex w-auto'>
					{gallery && gallery.items.map((item, index) => (
						<ImageTile key={index} item={item} hidePoster={item.tweet.author.id === profile?.id} ignoreMobile={demo} onClick={() => setSelectedGalleryItem(item)} />
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