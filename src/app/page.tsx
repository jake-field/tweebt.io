import { unstable_getServerSession } from "next-auth";
import LandingPage from "common/components/landing";
import NavBar from "common/components/navbar";
import Feed from "modules/gallery/components/feed";
import { getProfile } from "modules/twitterapi";

export default async function AppHome() {
	const session = await unstable_getServerSession();

	//Select a random profile if there is no session (landing page)
	const hourlyAccounts = ['@hourlyfoxes', '@otteranhour', '@hourlycats'];
	const randomProfile = hourlyAccounts.at(Math.floor(Math.random() * 3.0)) || '@hourlyfoxes';
	const profile = !session ? await getProfile(randomProfile) : undefined;

	return (
		<>
			{session ? (
				<div className='flex flex-col items-center w-full' >
					<NavBar session={session} /> {/* TODO: remove when layout supports getting path */}
					<Feed />
				</div>
			) : (
				<LandingPage profile={profile?.data!} />
			)}
		</>
	)
}