import { NextPageContext } from 'next';
import Profile from '../common/types/profile';
import { getProfile } from '../modules/twitterapi';
import { getSession } from 'next-auth/react';
import { Session } from 'next-auth';
import HandleFeed from '../modules/gallery/handlefeed';
import ProfileCard from '../common/components/profilecard';
import Title from '../common/components/title';

interface Props {
	profile?: Profile;
	error?: string;
	session?: Session;
}

// Export the `session` prop to use sessions with Server Side Rendering
export async function getServerSideProps(context: NextPageContext) {
	const res = await getProfile(context.query['handle'] as string);

	return {
		props: {
			session: await getSession(context),
			profile: res.profile || null,
			error: res.error || null,
		},
	}
}

export default function AtHandle({ profile, error, session }: Props) {

	if (error) {
		return <p>{error}</p>
	}

	if (!profile) {
		return <p>Profile error</p>
	}

	return (
		<>
			<Title
				title='My feed'
				desc=''
			/>
			<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-300 to-slate-200 dark:from-slate-900 dark:to-slate-800" style={{ paddingTop: '3em' }}>
				<ProfileCard profile={profile} />
				<HandleFeed session={session} profile={profile} />
			</div>
		</>
	)
}