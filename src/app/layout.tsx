import { unstable_getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import ScrollTop from '../common/components/scrolltop';
import Providers from '../common/contexts/providers';

//Global styles
import '../common/styles/globals.css';

//Root layout which encompasses all layouts
export default async function RootLayout({ children }: any) {
	const session = await unstable_getServerSession();

	const reqCookies = cookies();
	const theme = reqCookies.get('tweebt.theme')?.value;
	const deviceTheme = reqCookies.get('tweebt.systheme')?.value;
	const darkMode = (theme === 'dark' || theme === 'sys' && deviceTheme === 'dark') ? true : false;

	return (
		<html lang='en' className={darkMode ? 'dark' : undefined}>
			<head>
				<meta name="viewport" content="width=device-width" />
			</head>
			<body>
				<Providers session={session}>
					{/* {session && <NavBar session={session} />} */ /* TODO: reinclude this once we can retreive the current route in this file */}
					<ScrollTop />
					{children}
				</Providers>
			</body>
		</html>
	);
}