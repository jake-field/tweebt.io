//Global styles
import { unstable_getServerSession } from 'next-auth';
import NavBar from '../../common/components/navbar';
import '../../common/styles/globals.css';

interface Props {
	children: React.ReactNode;
}

//Root layout which encompasses all layouts
export default async function Layout({ children }: Props) {
	const session = await unstable_getServerSession() || undefined;

	return (
		<>
			<NavBar session={session} />
			{children}
		</>
	);
}