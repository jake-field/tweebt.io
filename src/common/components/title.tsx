interface Props {
	url?: string;
	title?: string;
	desc?: string;
	image?: string;
}

export default function Title({ url, title, desc, image }: Props) {
	const appName = 'tweebt.io';
	const ogTitle = title ? `${title}` : appName;
	const description = 'Search Twitter or view your feed as rolling gallery of images to streamline your browsing.';

	return (
		<>
			<link rel='icon' href='/favicon.ico' />

			<title>{title ? `${title} // ${appName}` : appName}</title>
			<meta property='og:title' content={ogTitle} />
			<meta property='twitter:title' content={ogTitle} />

			<meta property='og:type' content='website' />

			<meta property='description' content={desc ? desc : description} />
			<meta property='og:description' content={desc ? desc : description} />
			<meta property='twitter:description' content={desc ? desc : description} />

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