import Head from 'next/head';
import { useRouter } from 'next/router';

interface Props {
	title?: string;
	desc?: string;
	image?: string;
}

export default function Title({ title, desc, image }: Props) {
	const router = useRouter();
	const appName = 'tweebt';
	const description = 'Search Twitter or view your feed as rolling gallery of images to streamline your browsing.';
	
	return (
		<Head>
			<title>{title ? `${title} // ${appName}` : appName}</title>
			<link rel='icon' href='/favicon.ico' />

			<meta property='og:type' content='website' />
			<meta property='description' content={desc ? desc : description} />

			<meta property='og:title' content={title ? title : appName} />
			<meta property='twitter:title' content={title ? title : appName} />

			<meta property='og:description' content={desc ? desc : description} />
			<meta property='twitter:description' content={desc ? desc : description} />

			<meta property='og:url' content={router.asPath} />
			<meta property='twitter:url' content={router.asPath} />
			<meta property='twitter:domain' content={router.asPath} />

			{image &&
				<>
					<meta name='twitter:card' content='summary_large_image' />
					<meta property='twitter:image' content={image} />
					<meta property='og:image' content={image} />
				</>
			}
		</Head>
	)
}