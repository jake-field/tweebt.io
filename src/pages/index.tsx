import Searchbar from "../common/components/searchbar";

export default function Home() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-b from-slate-800 to-slate-900">
			<div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
				<h1 className="text-6xl font-bold">
					Tweebt gallery
				</h1>

				<p className="mt-3 text-2xl">
					search for tweebt
				</p>

				<div className='mt-10 p-5 flex flex-col items-center justify-center' >
					<Searchbar route='/' placeholder='Search by @' />
				</div>
			</div>
		</div>
	)
}