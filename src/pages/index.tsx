import { NextPageContext } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import LandingSearch from "../common/components/landingsearch";
import UserFeed from "../modules/gallery/userfeed";
import { authOptions } from "./api/auth/[...nextauth]";

interface Props {
	session?: Session;
}

//fetch the session on the serverside
export async function getServerSideProps(context: any /* NextPageContext */) {
	const session = await unstable_getServerSession(context.req, context.res, authOptions);
	return {
		props: {
			session: session
		},
	}
}

export default function Home({ session }: Props) {
	console.log('session:', session);

	return (
		<>
			{session ? (
				<UserFeed session={session} />
			) : (
				<LandingSearch />
			)}
		</>
	)
}