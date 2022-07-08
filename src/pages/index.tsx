import { NextPageContext } from "next";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Searchbar from "../common/components/searchbar";
import ThemeToggle from "../common/components/themetoggle";
import Title from "../common/components/title";

export default function Home() {
	const { data: session, status } = useSession();

	//force a sign-in
	if (typeof window !== "undefined" && !session) {
		signIn('twitter');
		return null;
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-b from-slate-300 to-slate-200 dark:from-slate-900 dark:to-slate-800">
			<Title />
			<div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
				<h1 className="text-6xl font-bold">
					Tweebt gallery
				</h1>

				{session?.user && <p>
					Hello {session.user.name}
					{session.user.image && <Image src={session.user.image} width={36} height={36} />}
				</p>}

				<p className="mt-3 text-2xl">
					search for tweebt
				</p>

				<div className='mt-10 p-5 flex flex-row items-center justify-center' >
					<Searchbar route='/' placeholder='Search by @' /><ThemeToggle />
				</div>
			</div>
		</div>
	)
}

// Export the `session` prop to use sessions with Server Side Rendering
export async function getServerSideProps(context: NextPageContext) {
	return {
		props: {
			session: await getSession(context),
		},
	}
}