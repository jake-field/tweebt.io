import Head from "next/head";

interface Props {
	title?: string;
}

export default function Title({ title }: Props) {
	return (
		<Head>
			<title>{title ? `${title} / Tweebt Gallery` : 'Tweebt Gallery'}</title>
			<link rel="icon" href="/favicon.ico" />
		</Head>
	)
}