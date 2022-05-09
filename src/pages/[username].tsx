import { GetStaticPaths, GetStaticProps } from 'next';
import { useEffect, useState } from 'react'
import Searchbar from '../common/components/searchbar';
import Title from '../common/components/title';
import GalleryMediaItem from '../modules/gallery/components/galleryitem';
import Placeholder from '../modules/gallery/components/placeholder';
import { Gallery } from '../modules/gallery/types/gallery';
import { getUserByUsername } from '../modules/twitter/twitterapi';
import { User } from '../modules/twitter/types/user';
import ProfileCard from '../common/components/profilecard';

interface Props {
	user: User | null;
}

export default function AtHandle({ user }: Props) {
	const [gallery, setGallery] = useState<Gallery | null>(null);
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		if (!user || user.errors) return;
		setLoading(true);
		fetch(`api/${user?.data?.id}`)
			.then((res) => res.json())
			.then((data) => {
				setGallery(data);
				setLoading(false);
			});
	}, [user, setGallery, setLoading]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<Title title={`@${user?.data?.username}`} />

			<div className="flex flex-col items-center w-full flex-1 px-20 text-center mt-10">
				<p hidden={!user?.errors}>
					{user?.errors?.map(error => {
						return <p>{error.detail}</p>
					})}
				</p>

				{user && <ProfileCard user={user} />}

				<div className='p-5 flex flex-col items-center justify-center' >
					<Searchbar route='/' placeholder='Search by @' value={`@${user?.data?.username}`} />
				</div>

				<div className="flex flex-wrap items-center justify-center max-w-7xl mt-10 sm:w-full">
					{gallery && !isLoading ? (
						gallery?.tweetMedia.map(item => {
							return <GalleryMediaItem key={item.media_key} item={item} />
						})
					) : (
						<>
							<Placeholder />
							<Placeholder />
							<Placeholder />
						</>
					)}
				</div>
			</div>
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