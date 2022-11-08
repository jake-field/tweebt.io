import { unstable_getServerSession } from 'next-auth';
import { cookies } from 'next/headers';
import ScrollTop from '../common/components/scrolltop';

//Global styles
import '../common/styles/globals.css';
import Providers from './providers';

interface Props {
	children: React.ReactNode;
}

//Root layout which encompasses all layouts
export default async function RootLayout({ children }: Props) {
	const session = await unstable_getServerSession();

	const reqCookies = cookies();
	const theme = reqCookies.get('tweebt.theme')?.value;
	const deviceTheme = reqCookies.get('tweebt.systheme')?.value;
	const darkMode = (theme === 'dark' || theme === 'sys' && deviceTheme === 'dark') ? true : false;

	return (
		<html lang='en' className={darkMode ? 'dark' : undefined}>
			<body>
				<Providers session={session}>
					<ScrollTop />
					{children}
				</Providers>
			</body>
		</html>
	);
}