import ProfileCard from 'modules/profile/profilecard';
import { getProfile } from 'modules/twitterapi';
import Feed from 'modules/gallery/components/feed';
import { unstable_getServerSession } from 'next-auth';
import NavBar from 'common/components/navbar';

interface Props {
	params: {
		userhandle: string
	}
}

export default async function UserProfile({ params: { userhandle } }: Props) {
	const session = await unstable_getServerSession() || undefined;
	const profile = await getProfile(`${!userhandle.startsWith('@') ? '@' : ''}${session && userhandle === 'me' ? session.user?.email : userhandle}`);

	return (
		<div className='flex flex-col items-center w-full'>
			<NavBar session={session} searchBarValue={profile.error ? userhandle : undefined} /> {/* TODO: remove when layout supports getting path */}
			{profile.data ? (
				<>
					<ProfileCard profile={profile.data} />
					<Feed profile={profile.data} />
				</>
			) : (
				<div className='fixed w-screen h-screen flex items-center justify-center select-none'>
					<div className='bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-700 border rounded-lg flex flex-col items-center justify-center p-4'>
						<h1 className='text-6xl border-b border-slate-300 dark:border-slate-700 px-5 pb-2 mb-2'>404</h1>
						<span className=''>Sorry! <span className='bg-slate-300 dark:bg-slate-700 rounded-md px-1'>{userhandle}</span> does not exist.</span>
						<span>Check your spelling or try another search!</span>
					</div>
				</div>
			)}
		</div>
	)
}