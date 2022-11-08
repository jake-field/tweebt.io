'use client';

import SessionProvider from "../common/contexts/sessionprovider";
import SettingsProvider from "../common/contexts/settingscontext";

export default function Providers({ children, session }: any) {
	return (
		<SessionProvider session={session} refetchOnWindowFocus refetchInterval={60 * 10}>
			<SettingsProvider>
				{children}
			</SettingsProvider>
		</SessionProvider>
	);
}