import ProfileCard from '../../modules/profile/profilecard';
import { getProfile } from '../../modules/twitterapi';
import Feed from './feed';

interface Props {
	params: {
		userhandle: string
	}
}

export default async function UserProfile({ params: { userhandle } }: Props) {
	const profile = await getProfile(`${!userhandle.startsWith('@') ? '@' : ''}${userhandle}`);

	if (!profile?.data) {
		console.log(profile)
		return (
			<div>error</div>
		)
	}

	return (
		<div className='flex flex-col items-center w-full'>
			{profile && <ProfileCard profile={profile.data} />}
			<Feed profile={profile.data || undefined} />
		</div>
	)
}