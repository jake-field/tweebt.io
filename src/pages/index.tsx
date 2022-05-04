import { SearchIcon } from '@heroicons/react/solid'

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
					<form className='p-1 flex flex-row'>
						<input type='text' name='query' className='rounded-sm p-1 text-black' />
						<button className="bg-blue-400 text-black p-1 ml-1 rounded-sm w-9" type='submit'><SearchIcon /></button>
					</form>
				</div>
			</div>
		</div>
	)
}