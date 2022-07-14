import { Session } from "next-auth"
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import LoadingSpinner from "../../common/components/loadingspinner";
import NavBar from "../../common/components/navbar";
import ScrollTop from "../../common/components/scrolltop";
import Title from "../../common/components/title";
import Gallery from "../shared/types/gallery";
import GalleryNewComponent from "./components/gallerynew";

interface Props {
	session?: Session;
}

export default function UserFeed({ session }: Props) {
	const router = useRouter();
	const [gallery, setGallery] = useState<Gallery[]>([]);
	const [loading, setLoading] = useState(false);

	//If not logged in, don't bother
	if (!session) {
		return <p>Unauthorized</p>
	}

	useEffect(() => {
		if (gallery.length === 0 && !loading) fetchData();
		return () => {
			setGallery([]);
			console.log('cleared gallery');
		}
	}, [router]);

	function fetchData() {
		console.log('fetch request')
		if (loading) return;
		setLoading(true);
		console.log('fetch request in action');

		let pagination = '';
		if (gallery.length > 0) {
			const token = gallery[gallery.length - 1].meta?.next_token;
			pagination = token ? '&next=' + token : '';
		}

		fetch(`/api/gallery/me?&max_results=100${pagination}`) //exclude=replies,retweets
			.then((res) => {
				//intercept response status to catch errors
				if (res.status != 200) {
					//TODO: this should be refreshed using refresh tokens, please implement this ASAP
					signOut();
					router.push('/');
					throw res.statusText
				}
				return res
			})
			.then((res) => res.json())
			.then((data: Gallery) => {
				if (data.items && data.items.length > 0) {
					setGallery([...gallery, data]);
				}
			}).finally(() => {
				setLoading(false);
			}).catch(err => {
				console.log(err)
			});
	}

	function hasMore() {
		if (gallery.length > 0) {
			return gallery[gallery.length - 1].meta?.next_token ? true : false;
		}

		return (gallery.length === 0);
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-slate-300 dark:bg-slate-800" style={{ paddingTop: '5em' }}>
			<Title
				title='My feed'
				desc=''
			/>

			<div className="flex flex-col items-center w-full px-3 text-center md:px-20">
				<InfiniteScroll
					className='w-fit max-w-[2500px] select-none mb-40 mt-20'
					initialLoad={false}
					loadMore={fetchData}
					hasMore={hasMore()}
					threshold={1000} //so high due to react-masonry-css having heavily unbalanced columns, this helps hide the troughs
				>
					<GalleryNewComponent gallery={gallery} />
				</InfiniteScroll>

				{(loading || hasMore()) &&
					<div className='flex flex-row items-center justify-center'>
						<LoadingSpinner className='w-10 h-10' />
					</div>
				}
			</div>
		</div>
	)
}