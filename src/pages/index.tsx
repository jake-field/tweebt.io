import Searchbar from "../common/components/searchbar";
import ThemeToggle from "../common/components/themetoggle";
import Title from "../common/components/title";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-b from-slate-300 to-slate-200 dark:from-slate-900 dark:to-slate-800">
			<Title />
			<div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
				<h1 className="text-6xl font-bold">
					Tweebt gallery
				</h1>

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