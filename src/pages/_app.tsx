import '../common/styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../common/components/layout';
import Script from 'next/script';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</>
	)
}