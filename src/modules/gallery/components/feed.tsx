'use client';

import { useContext, useEffect, useState } from 'react';
import { ResultsContext } from 'common/contexts/appsettings/results';
import getGallery, { GalleryParams } from '..';
import Gallery from '../types/gallery';
import { ProfileData } from 'modules/profile/types/profile';
import { Media } from '../types/gallery.types';
import ImagePopup from './imagepopup';
import InfiniteScroll from 'react-infinite-scroller';
import Masonry from 'react-masonry-css';
import ImageTile from './imagetile';
import SpinnerIcon from 'common/icons/spinnericon';
import { usePathname } from 'next/navigation';
import TileOverlay from './tileoverlay';
import { tempHeadFix } from 'common/components/title';

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

	const [hoveredItem, setHoveredItem] = useState<Media>();
	const [hoveredElement, setHoveredElement] = useState<any>();

	//Fetch gallery data on profile/search update, also update title as per Next13 head.tsx bug
	useEffect(() => {
		//TODO: fix for Next13 bug (pathname check for root demo)
		if (searchQuery) {
			tempHeadFix({
				url: `tweebt.io/search?q=${searchQuery}`,
				title: searchQuery,
				desc: `Image search results for ${searchQuery}`,
			});
		} else if (profile && pathname !== '/') {
			tempHeadFix({
				url: `tweebt.io/${profile.handle}`,
				title: `${profile.name} (@${profile.handle})`,
				image: profile.image.replace('400x400', '200x200'),
				desc: profile.bio ? profile.bio : `Check out ${profile.name}'s (@${profile.handle}) latest tweets as a rolling gallery without ads or distractions!`,
			});
		}

		//force a gallery wipe if searching
		fetchData(0, searchQuery !== undefined);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [profile, searchQuery]);

	//function for fetching data
	function fetchData(_page?: number, wipe?: boolean) {
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
			{!demo && gallery && //Global UI
				<>
					<ImagePopup item={selectedGalleryItem} onClick={() => setSelectedGalleryItem(undefined)} />
					<TileOverlay
						item={hoveredItem}
						target={hoveredElement}
					/>
				</>
			}

			<InfiniteScroll
				className='w-full max-w-[2500px]'
				initialLoad={false} //even when true this doesn't seem to fire, set false just incase this changes
				loadMore={fetchData}
				hasMore={hasMore()}
				threshold={2500} //so high due to react-masonry-css having heavily unbalanced columns, this helps hide the troughs
			>
				<Masonry breakpointCols={breakpointColumnsObj} className='flex w-auto'>
					{gallery && gallery.items.map((item, index) => (
						<ImageTile key={index} item={item} onClick={() => setSelectedGalleryItem(item)} onHover={(e) => { setHoveredElement(e?.currentTarget); setHoveredItem(item) }} />
					))}
				</Masonry>
			</InfiniteScroll>

			{(gallery && !hasMore()) && !loading ? (
				<div className='flex flex-row items-center justify-center h-48 text-gray-600 dark:text-gray-400 whitespace-pre-wrap'>
					{gallery?.error ? gallery.error.title.startsWith('403') && profile ? `${profile.handle}'s profile is inaccessible because it is ${profile.protected ? 'protected.\nMake sure you\'re logged in to an account that can see their posts!' : 'deleted/suspended.'}`
						: `${gallery?.error?.title}\n${gallery?.error?.detail}`
						: gallery?.items.length === 0 ? 'Nothing but crickets...'
							: 'You\'ve gone as far back as I can show!'}
				</div>
			) : (
				<div key='loader' className='flex flex-row items-center justify-center h-48'>
					<SpinnerIcon className='w-10 h-10' />
				</div>
			)}
		</div>
	)
}