import ProfileCard from '../../modules/profile/profilecard';
import { getProfile } from '../../modules/twitterapi';
import Feed from '../../modules/gallery/components/feed';
import { unstable_getServerSession } from 'next-auth';
import NavBar from '../../common/components/navbar';

interface Props {
	params: {
		userhandle: string
	}
}

export default async function UserProfile({ params: { userhandle } }: Props) {
	const session = await unstable_getServerSession() || undefined;
	const profile = await getProfile(`${!userhandle.startsWith('@') ? '@' : ''}${session && userhandle === 'me' ? session.user?.email : userhandle}`);

	if (!profile?.data) {
		console.log(profile)
		return (
			<div>error</div>
		)
	}

	return (
		<div className='flex flex-col items-center w-full'>
			<NavBar session={session} /> {/* TODO: remove when layout supports getting path */}
			{profile && <ProfileCard profile={profile.data} />}
			<Feed profile={profile.data || undefined} />
		</div>
	)
}