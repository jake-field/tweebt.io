import { unstable_getServerSession } from 'next-auth';
import Title from 'common/components/title';
import { getProfile } from 'modules/twitterapi';

interface Props {
	params: {
		userhandle: string
	}
}

export default async function Head({ params: { userhandle } }: Props) {
	const session = await unstable_getServerSession() || undefined;
	const profile = await getProfile(`${!userhandle.startsWith('@') ? '@' : ''}${session && userhandle === 'me' ? session.user?.email : userhandle}`);

	if (!profile?.data) {
		return (
			<title>404 - User Not Found // tweebt.io</title>
		)
	}

	return (
		<Title
			url={`tweebt.io/@${profile.data.handle}`}
			title={`${profile.data.name} (@${profile.data.handle})`}
			image={profile.data.image.replace('400x400', '200x200')}
			desc={profile.data.bio ? profile.data.bio : `Check out ${profile.data.name}'s (@${profile.data.handle}) latest tweets as a rolling gallery without ads or distractions!`}
		/>
	)
}