import { getProfile } from "../../modules/twitterapi";

interface Props {
	params: {
		userhandle: string
	}
}

export default async function Head({ params: { userhandle } }: Props) {
	const profile = await getProfile(`${!userhandle.startsWith('@') ? '@' : ''}${userhandle}`);

	if (!profile?.data) {
		console.log(profile)
		return (
			<title>404 - User Not Found // tweebt.io</title>
		)
	}

	const title = `${profile.data.name} (@${profile.data.handle})`;
	const image = profile.data.image.replace('400x400', '200x200');
	const desc = `Check out ${profile.data.name}'s (@${profile.data.handle}) latest tweets as a rolling gallery without ads or distractions!`;
	const appName = 'tweebt.io';
	const ogTitle = title ? `${title}` : appName;
	const description = 'Search Twitter or view your feed as rolling gallery of images to streamline your browsing.';

	return (
		<>
			<link rel='icon' href='/favicon.ico' />

			<title>{`${title} // ${appName}`}</title>
			<meta property='og:title' content={ogTitle} />
			<meta property='twitter:title' content={ogTitle} />

			<meta property='og:type' content='website' />

			<meta property='description' content={desc ? desc : description} />
			<meta property='og:description' content={desc ? desc : description} />
			<meta property='twitter:description' content={desc ? desc : description} />

			<meta property='og:url' content={`https://tweebt.io/@${profile.data.handle}`} />
			<meta property='twitter:url' content={`https://tweebt.io/@${profile.data.handle}`} />
			<meta property='twitter:domain' content={`https://tweebt.io/@${profile.data.handle}`} />

			{image && image.length > 0 &&
				<>
					<meta name='twitter:card' content='summary_large_image' />
					<meta property='twitter:image' content={image} />
					<meta property='og:image' content={image} />
				</>
			}
		</>
	)
}