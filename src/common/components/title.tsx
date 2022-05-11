import Head from "next/head";
import { useRouter } from "next/router";

interface Props {
	title?: string;
	desc?: string;
}

export default function Title({ title, desc }: Props) {
	const router = useRouter();
	return (
		<Head>
			<title>{title ? `${title} / Tweebt Gallery` : 'Tweebt Gallery'}</title>
			<link rel="icon" href="/favicon.ico" />

			<meta property="og:title" content={title ? title : 'Tweebt Gallery'} />
			<meta property="og:description" content={desc ? desc : 'A useful website to display Twitter as a compiled gallery of media from tweets'} />
			<meta property="og:url" content={router.asPath} />
		</Head>
	)
}