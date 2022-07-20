import { Session, unstable_getServerSession } from "next-auth";
import LandingSearch from "../common/components/landingsearch";
import ProfileCard from "../common/components/profilecard";
import Title from "../common/components/title";
import { validateHandle } from "../common/utils/validation";
import { getProfile } from "../modules/twitterapi";
import { authOptions } from "./api/auth/[...nextauth]";
import Profile from '../common/types/profile';
import GalleryFeed from "../modules/gallery/galleryfeed";

interface Props {
	session: Session | null;
	profile: Profile | null;
	error: string | null;
	apiEndpoint: string;
}

//fetch the session on the serverside
export async function getServerSideProps(context: any /* NextPageContext */): Promise<{ props: Props }> {
	console.log(context.query)

	//fetch session using NextAuth recommened server-side function (NextPageContext does not like this function)
	const session = await unstable_getServerSession(context.req, context.res, authOptions);

	//check for and attempt to grab user profile
	const query = context.query['query'] as string[] || undefined;

	if (query) {
		const isHandle = (query[0] !== 'search') && validateHandle(query[0]);

		//if it's a valid handle, attempt to fetch the profile for it
		if (isHandle) {
			//query is a valid handle, attempt to fetch profile
			const res = await getProfile(query[0]);

			//if we get a valid profile, return that
			if (res.profile) {
				return {
					props: {
						session: session,
						profile: res.profile,
						apiEndpoint: `/api/gallery/user/${res.profile.id}`,
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
				apiEndpoint: search ? `/api/gallery/search?q=${search}` : '/api/gallery/me',
				error: search ? null : 'no search term provided'
			},
		}
	}
	else {
		//no query passed, endpoint will be timeline feed
		return {
			props: {
				session: session,
				profile: null,
				apiEndpoint: '/api/gallery/me',
				error: null
			},
		}
	}

	//search: `/api/gallery/search?q=${q}&max_results=100${pagination}`
	//handle: `/api/gallery/user/${profile.id}?&max_results=100${pagination}`) //exclude=replies,retweets
	//timeline: `/api/gallery/me?&max_results=100${pagination}`) //exclude=replies,retweets
}

export default function Home({ session, profile, apiEndpoint, error }: Props) {

	if (error) {
		return (
			<div className='flex justify-center items-center w-screen h-screen'>
				<Title
					title={`Error`}
				/>
				<p>{error}</p>
			</div>
		)
	}

	return (
		<div className='pt-20 flex flex-col justify-center items-center'>
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
						title={apiEndpoint.includes('search') ? `Search Results` : `Latest Tweets`}
					/>
					<GalleryFeed apiEndpoint={apiEndpoint} />
				</>
			) || (
					<LandingSearch />
				)}
		</div>
	)
}