import { signIn } from "next-auth/react";
import Title from "./title";

export default function LandingSearch() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-b from-slate-300 to-slate-200 dark:from-slate-900 dark:to-slate-800">
			<Title />
			<div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
				<h1 className="text-6xl font-bold">
					Tweebt gallery
				</h1>

				<p className="mt-3 text-2xl">
					search for tweebt or <span className='cursor-pointer text-blue-500 hover:text-blue-200' onClick={() => signIn('twitter')}>log in</span> to see your feed
				</p>
			</div>
		</div>
	)
}