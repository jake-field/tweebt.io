import { unstable_getServerSession } from 'next-auth';
import NavBar from '../../common/components/navbar';

export default async function Layout({ children }: any) {
	const session = await unstable_getServerSession() || undefined;

	return (
		<>
			<NavBar session={session} />
			{children}
		</>
	);
}