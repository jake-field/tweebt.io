import { GetStaticPaths, GetStaticProps } from 'next';
import { useEffect, useState } from 'react'
import Searchbar from '../common/components/searchbar';
import Title from '../common/components/title';
import GalleryMediaItem from '../modules/gallery/components/galleryitem';
import { Gallery } from '../modules/gallery/types/gallery';
import { getUserByUsername } from '../modules/twitter/twitterapi';
import { User } from '../modules/twitter/types/user';
import ProfileCard from '../common/components/profilecard';
import InfiniteScroll from 'react-infinite-scroller';
import Placeholder from '../modules/gallery/components/placeholder';
import Footer from '../common/components/footer';

interface Props {
	user: User | null;
}

export default function AtHandle({ user }: Props) {
	const [currentUser, setCurrentUser] = useState<User | null>(null);
	const [galleries, setGalleries] = useState<Gallery[] | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (!user || user.errors) return;
		setLoading(true);
		setCurrentUser(user);
		fetch(`api/${user?.data?.id}`)
			.then((res) => res.json())
			.then((data) => {
				setGalleries([data]);
				setLoading(false);
			});
	}, [user, setGalleries, setLoading]);

	async function fetchData(page: number) {
		const url = `api/${user?.data?.id}`;
		const pagination = galleries ? `?next=${galleries[galleries.length - 1].pagination?.next_token}` : '';

		if (!user) return null;

		await fetch(page > 0 ? url + pagination : url)
			.then((res) => res.json())
			.then((data) => {
				if (user.data?.id === currentUser?.data?.id) {
					setGalleries([...galleries!, data]);
				} else {
					setGalleries([data]);
					setCurrentUser(user);
				}
			});
	}

	function hasMore(): boolean {
		return !galleries || galleries && galleries[galleries.length - 1].pagination?.next_token !== undefined || false;
	}

	if (!user) return null;

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-b from-slate-900 to-slate-800">
			<Title title={`@${user?.data?.username}`} />

			<div className="flex flex-col items-center w-full flex-1 px-20 text-center pt-16">
				<div className='p-3 shadow-2xl flex flex-row items-center justify-center absolute top-0 w-full bg-slate-900 border-b border-slate-800' >
					<h1 className='mr-auto font-bold'>Tweebt Gallery</h1>
					<Searchbar route='/' placeholder='Search by @' value={`@${user?.data?.username}`} />
				</div>

				<p hidden={!user?.errors}>
					{user?.errors?.map(error => {
						return <p key={error.detail}>{error.detail}</p>
					})}
				</p>

				{user && <ProfileCard user={user} />}

				{!loading && galleries && galleries[0].tweetMedia.length ? (
					<InfiniteScroll
						className='flex flex-wrap items-center justify-center max-w-7xl mt-7 w-fit'
						pageStart={0}
						loadMore={fetchData}
						initialLoad={false}
						hasMore={hasMore()}
						loader={<Placeholder key={0} />}
					>
						{galleries ? (
							galleries.map(gallery => {
								return gallery.tweetMedia.map(item => {
									return <GalleryMediaItem key={item.media_key} item={item} />
								})
							})
						) : (
							<p>Nothing to see here</p>
						)}
					</InfiniteScroll>
				) : user?.data?.protected ? (
					<p className='m-10'>@{user.data.username}&apos;s tweets are protected</p>
				) : (
					<Placeholder />
				)}
			</div>

			<Footer />
		</div>
	)
}

//This is required for dynamic SSG
//TODO: double check that this is right, technically we should be caching the userID
//		this will be regenerated every request on npm run dev. Try for production
export const getStaticPaths: GetStaticPaths = async () => {
	return {
		// Only `/posts/1` and `/posts/2` are generated at build time
		paths: [],
		// Enable statically generating additional pages
		// For example: `/posts/3`
		fallback: true,
	}
}

//Get the user before sending the page to the client
//this helps with error handling and prefetching data the user doesn't need to do
//saves useEffect and fetch times on slower connections.
//Consider pre-fetching the first gallery pull as well for slow mobile connections?
export const getStaticProps: GetStaticProps = async (context) => {
	const test = context.params;
	let user: User | null = null;

	if (test) {
		const username = test['username'] as string;
		user = await getUserByUsername(username);
	}

	//Don't revalidate the user as we are only fetching for the userID right now
	//If we need updated user profiles, like profile image or name/username we need to revalidate
	return {
		props: {
			user,
		}
	}
}