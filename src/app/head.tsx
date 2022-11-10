import { unstable_getServerSession } from "next-auth";
import Title from "../common/components/title";

export default async function RootHead() {
	const session = await unstable_getServerSession();

	return (
		<Title title={session ? 'Latest Tweets' : undefined} />
	)
}