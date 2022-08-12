import { Session, unstable_getServerSession } from 'next-auth';
import Title from '../common/components/title';
import { validateHandle } from '../modules/profile/utils/validation';
import { getProfile } from '../modules/twitterapi';
import { authOptions } from './api/auth/[...nextauth]';
import { ProfileData } from '../modules/profile/types/profile';
import GalleryFeed from '../modules/gallery/galleryfeed';
import Landing from '../common/components/landing';
import ProfileCard from '../modules/profile/profilecard';
import { useRouter } from 'next/router';

interface Props {
	session: Session | null;
	profile: ProfileData | null;
	error: { title: string, details: string } | null;
	apiEndpoint: string;
}

//fetch the session on the serverside
export async function getServerSideProps(context: any /* NextPageContext */): Promise<{ props: Props }> {
	//fetch session using NextAuth recommened server-side function (NextPageContext does not like this function)
	const session = await unstable_getServerSession(context.req, context.res, authOptions);

	//check for and attempt to grab user profile
	const slug = context.query['query'] as string[] || undefined;
	const query = slug ? slug.at(0)?.replace('me', `@${session?.user?.email}` || '') : undefined; //TODO: consider q here as per how the api works
	const q = context.query['q'] as string || undefined;

	const isHandle = query ? (query !== 'search') && validateHandle(query) : false;
	const search = query && (query === 'search') && q ? encodeURIComponent(q) : undefined;

	//Fetch profile if a handle is passed in (query is valid here if isHandle is valid)
	const profileRes = isHandle ? await getProfile(query!) : null;

	//getServerSideProps does not support type of `undefined`, use `null` instead
	return {
		props: {
			//session
			session: session,

			//If we queried for the profile, attempt to return that, or null
			profile: profileRes ? profileRes.data || null : null,

			//Select endpoint based on query slug data, defaulting to your feed on error
			apiEndpoint: profileRes?.data ? `/api/user/${profileRes.data.id}` : search ? `/api/search/${search}` : '/api/feed',

			//Return potential profile error if requested
			error: profileRes?.error || null
		},
	}

	//search: `/api/search/${q}&max_results=100${pagination}`
	//handle: `/api/user/${profile.id}?&max_results=100${pagination}`) //exclude=replies,retweets
	//timeline: `/api/feed?&max_results=100${pagination}`) //exclude=replies,retweets
}

export default function Home({ session, profile, apiEndpoint, error }: Props) {
	const router = useRouter();

	if (error) {
		return (
			<div className='flex flex-col items-center w-screen min-h-screen pt-20'>
				<Title
					title={`Error`}
				/>
				<span className='flex flex-col gap-2 h-fit items-center justify-center p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-400 dark:border-slate-700'>
					<h1 className='w-full text-center border-b border-slate-300 dark:border-slate-700'>{error.title}</h1>
					{error.details}
				</span>
			</div>
		)
	}

	return (
		<div className='flex flex-col items-center min-h-screen pt-20 px-1'>
			{profile && (
				<>
					<Title
						title={`${profile.name} (@${profile.handle})`}
						image={profile.image.replace('400x400', '200x200')}
						desc={`Check out ${profile.name}'s (@${profile.handle}) latest tweets as a rolling gallery without ads or distractions!`}
					/>
					<ProfileCard profile={profile} />
					<GalleryFeed apiEndpoint={apiEndpoint} />
				</>
			) || (session || apiEndpoint.includes('search')) && (
				<>
					<Title
						title={apiEndpoint.includes('search') ? `${router.query['q']}` : `Latest Tweets`}
					/>
					<GalleryFeed apiEndpoint={apiEndpoint} />
				</>
			) || (
					<>
						<Title />
						<Landing />
					</>
				)}
		</div>
	)
}