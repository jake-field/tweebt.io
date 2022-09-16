import '../common/styles/globals.css';
import React from 'react';
import { SessionProvider } from 'next-auth/react';
import Layout from '../common/components/layout';
import SettingsProvider from '../common/contexts/settingscontext';

export default function App({ Component, pageProps }: any) {
	return (
		<SessionProvider session={pageProps.session} refetchInterval={5 * 60} refetchOnWindowFocus={true}>
			<SettingsProvider>
				<Layout session={pageProps.session}>
					<Component {...pageProps} />
				</Layout>
			</SettingsProvider>
		</SessionProvider>
	)
}