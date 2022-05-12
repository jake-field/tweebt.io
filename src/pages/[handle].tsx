import { GetStaticPaths, GetStaticProps } from 'next';
import Title from '../common/components/title';
import ProfileCard from '../common/components/profilecard';
import Footer from '../common/components/footer';
import GalleryComponent from '../modules/gallery/components/gallery';
import NavBar from '../common/components/navbar';
import Profile from '../common/types/profile';
import { getProfile } from '../modules/twitter/twitterapi';

interface Props {
	profile?: Profile;
	error?: string;
}

export default function AtHandle({ profile, error }: Props) {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-b from-slate-300 to-slate-200 dark:from-slate-900 dark:to-slate-800">
			<Title
				title={profile && `@${profile.handle}'s Twitter Gallery`}
				desc={profile && `Check out ${profile.name}'s (@${profile.handle}) gallery compiled from their most recent tweets!`}
				image={profile && profile.image}
			/>
			<NavBar />
			<div className="flex flex-col items-center w-full flex-1 px-3 text-center pt-10 sm:pt-0 md:px-20">
				{profile ? (
					<>
						<ProfileCard profile={profile} />
						<GalleryComponent profile={profile} />
					</>
				) : (
					<>
						{error && <p className='mt-16'>{error}</p>}
					</>
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
	if (!context.params) return { props: { error: 'error' } };

	const res = await getProfile(context.params['handle'] as string);

	if (res.error) return { props: { error: res.error } };

	//Don't revalidate the user as we are only fetching for the userID right now
	//If we need updated user profiles, like profile image or name/username we need to revalidate
	return {
		props: {
			profile: res.profile,
		}
	}
}