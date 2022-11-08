import Title from "../../common/components/title";
import { getProfile } from "../../modules/twitterapi";

interface Props {
	params: {
		userhandle: string
	}
}

export default async function Head({ params: { userhandle } }: Props) {
	const profile = await getProfile(`${!userhandle.startsWith('@') ? '@' : ''}${userhandle}`); //react will dedupe

	if (!profile?.data) {
		console.log(profile)
		return (
			<title>404 - User Not Found // tweebt.io</title>
		)
	}

	return (
		<Title
			url={`tweebt.io/${userhandle}`}
			title={`${profile.data.name} (@${profile.data.handle})`}
			image={profile.data.image.replace('400x400', '200x200')}
			desc={`Check out ${profile.data.name}'s (@${profile.data.handle}) latest tweets as a rolling gallery without ads or distractions!`}
		/>
	)
}