import { NextPageContext } from "next";
import { Session } from "next-auth";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import LoadingSpinner from "../../common/components/loadingspinner";
import ScrollTop from "../../common/components/scrolltop";
import Title from "../../common/components/title";
import GalleryNewComponent from "../../modules/gallery/components/gallerynew";
import Gallery from "../../modules/shared/types/gallery";

interface Props {
	session: Session | null;
}

//grab the session on the server and pass it via component props
export async function getServerSideProps(context: NextPageContext): Promise<{ props: Props }> {
	return {
		props: {
			session: await getSession(context),
		},
	}
}

export default ({ session }: Props) => {
	const router = useRouter();
	const { query: { query, q, tags } } = router;

	console.log('slug: ', query);

	const [gallery, setGallery] = useState<Gallery[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!loading) fetchData();
		return () => {
			setGallery([]);
			console.log('cleared gallery');
		}
	}, [query]);

	function fetchData() {
		if (loading) return;
		setLoading(true);
		console.log('fetch');

		let pagination = '';
		if (gallery.length > 0) {
			const token = gallery[gallery.length - 1].meta?.next_token;
			pagination = token ? '&next=' + token : '';
		}

		fetch(`/api/gallery/search?q=${q}&max_results=100${pagination}`)
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
				console.log('data: ', data)
				if (data.items && data.items.length > 0) {
					console.log('hello there uwu')
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

		return false;
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-b from-slate-300 to-slate-200 dark:from-slate-900 dark:to-slate-800">
			<Title
				title={query && `${query}`}
				desc=''
			/>

			<ScrollTop />
			<div className="flex flex-col items-center w-full flex-1 px-3 text-center pt-10 sm:pt-0 md:px-20">
				<InfiniteScroll
					className='w-fit max-w-[2500px] select-none mb-40'
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