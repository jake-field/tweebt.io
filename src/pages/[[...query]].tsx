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
	const query = context.query['query'] as string[] || undefined;

	console.log('query = ', query);
	console.log('context.query = ', context.query);

	if (query) {
		const isHandle = (query[0] !== 'search') && validateHandle(query[0]);

		//if it's a valid handle, attempt to fetch the profile for it
		if (isHandle) {
			//query is a valid handle, attempt to fetch profile
			const res = await getProfile(query[0]);

			//if we get a valid profile, return that
			if (res.data) {
				return {
					props: {
						session: session,
						profile: res.data,
						apiEndpoint: `/api/user/${res.data.id}`,
						error: res.error || null
					},
				}
			} else {
				return {
					props: {
						session: session,
						profile: null,
						apiEndpoint: ``,
						error: res.error || null
					},
				}
			}
		}

		const search = context.query['q'] ? encodeURIComponent(context.query['q']) : undefined;

		//at this point we need to commit to searching
		return {
			props: {
				session: session,
				profile: null,
				apiEndpoint: search ? `/api/search/${search}` : '/api/feed',
				error: null
			},
		}
	}
	else {
		//no query passed, endpoint will be timeline feed
		return {
			props: {
				session: session,
				profile: null,
				apiEndpoint: '/api/feed',
				error: null
			},
		}
	}

	//search: `/api/gallery/search?q=${q}&max_results=100${pagination}`
	//handle: `/api/gallery/user/${profile.id}?&max_results=100${pagination}`) //exclude=replies,retweets
	//timeline: `/api/gallery/me?&max_results=100${pagination}`) //exclude=replies,retweets
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