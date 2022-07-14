import { NextPageContext } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";
import LandingSearch from "../common/components/landingsearch";
import UserFeed from "../modules/gallery/userfeed";

interface Props {
	session?: Session;
}

//fetch the session on the serverside
export async function getServerSideProps(context: NextPageContext) {
	return {
		props: {
			session: await getSession(context),
		},
	}
}

export default function Home({ session }: Props) {
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