import '../common/styles/globals.css'
import React from 'react';
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import Layout from '../common/components/layout'

//TODO: this needs to be stripped out into it's own file for reference such that
//		children components can use UseContext(SettingsContext)
const SettingsContext = React.createContext({
	sfw: true,
});

export default function App({ Component, pageProps }: AppProps) {
	return (
		<SessionProvider session={pageProps.session} refetchInterval={3600}>
			<SettingsContext.Provider value={{ sfw: true }}>
				<Layout session={pageProps.session}>
					<Component {...pageProps} />
				</Layout>
			</SettingsContext.Provider>
		</SessionProvider>
	)
}