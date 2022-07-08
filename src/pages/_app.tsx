import '../common/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import Layout from '../common/components/layout';

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SessionProvider session={pageProps.session} refetchInterval={3600}>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</SessionProvider>
	)
}