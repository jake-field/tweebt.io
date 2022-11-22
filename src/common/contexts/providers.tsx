'use client';

import { SessionProvider } from 'next-auth/react';
import ResultsProvider from './appsettings/results';
import ThemeProvider from './appsettings/theme';
import ViewProvider from './appsettings/view';

export default function Providers({ children, session }: any) {
	return (
		<SessionProvider session={session} refetchOnWindowFocus refetchInterval={60 * 10}>
			<ThemeProvider>
				<ViewProvider>
					<ResultsProvider>
						{children}
					</ResultsProvider>
				</ViewProvider>
			</ThemeProvider>
		</SessionProvider>
	);
}