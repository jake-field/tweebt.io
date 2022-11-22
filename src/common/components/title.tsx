interface Props {
	url?: string;
	title?: string;
	desc?: string;
	image?: string;
}

//TODO: remove this function when Next13 fixes the head issue
//Fix head issue, currently NextJS 13 head files are static and do not update with Next/Link routing
export function tempHeadFix({ url, title, desc, image }: Props) {
	if (typeof document === undefined) return; //client-side fix only

	const appName = 'tweebt.io';
	const ogTitle = title ? `${title}` : appName;
	const description = desc ? desc : 'Search Twitter users, hashtags, topics, or your personal feed as a moasaic gallery of images to streamline your browsing';

	document.title = title ? `${title} // ${appName}` : appName;

	//iterate over meta tags
	const tags = document.head.getElementsByTagName('meta');
	for (let tag of tags) {
		const type = tag.attributes.getNamedItem('property');
		if (!type) continue; //skip other meta tags
		if (type.value.match(/title/)) tag.setAttribute('content', ogTitle);
		if (type.value.match(/description/)) tag.setAttribute('content', description);
		if (url && type.value.match(/(url)|(domain)/)) tag.setAttribute('content', url);
	}
}

export default function Title({ url, title, desc, image }: Props) {
	const appName = 'tweebt.io';
	const ogTitle = title ? `${title}` : appName;
	const description = desc ? desc : 'Search Twitter users, hashtags, topics, or your personal feed as a moasaic gallery of images to streamline your browsing';

	return (
		<>
			<link rel='icon' href='/favicon.ico' />

			<title>{title ? `${title} // ${appName}` : appName}</title>
			<meta property='og:title' content={ogTitle} />
			<meta property='twitter:title' content={ogTitle} />

			<meta property='og:type' content='website' />

			<meta property='description' content={description} />
			<meta property='og:description' content={description} />
			<meta property='twitter:description' content={description} />

			<meta property='og:url' content={url} />
			<meta property='twitter:url' content={url} />
			<meta property='twitter:domain' content={url} />

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