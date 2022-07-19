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


	//TODO: /* entry
	//	check the incoming query, if slug doesn't start with search, validate query as a handle
	//	validation against @ or numerical profile ID
	//	if valid, call getProfile, we could even attempt this on non-@ inputs
	//	if not valid, return a null profile and the error, but most likely initiate a proper search on page load
	//	this way this becomes an SPA, however having the url so mismatched would be painful, so a reroute to the search url would be more ideal

	//if we do the above, then we don't need to worry about handling http errors as much
	// then we need to see if we can jam this page into index so we don't have multiple feeds
	// which we might just have to do regardless, get smart to reduce

	//then once this page is solidified, and the error object has a proper type, we can move on to refactoring the backend

	//get profile
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
				title={`${profile.name} (@${profile.handle})`}
				image={profile.image.replace('400x400', '200x200')}
				desc={`Check out ${profile.name}'s (@${profile.handle}) latest tweets as a rolling gallery without ads or distractions!`}
			/>
			<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-300 to-slate-200 dark:from-slate-900 dark:to-slate-800" style={{ paddingTop: '3em' }}>
				<ProfileCard profile={profile} />
				<HandleFeed session={session} profile={profile} />
			</div>
		</>
	)
}