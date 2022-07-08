import { Session } from "next-auth";
import Link from "next/link";
import ProfileCombo from "./profilecombo";
import Searchbar from "./searchbar";
import ThemeToggle from "./themetoggle";

interface Props {
	searchValue?: string;
	session?: Session;
}

export default function NavBar({ searchValue, session }: Props) {
	return (
		<div className='py-3 px-2 sm:px-3 shadow-2xl flex flex-row items-center justify-center absolute top-0 w-full bg-slate-200 dark:bg-slate-900 border-b border-slate-400 dark:border-slate-800' >
			<Link href='/'><h1 className='font-bold w-40 cursor-pointer'>Tweebt Gallery</h1></Link>
			<ul className='flex flex-row space-x-3 mr-auto'>
				<li>Home</li>
				<li>Profile</li>
			</ul>
			<Searchbar route='/' placeholder='Search by @, # or topic' value={searchValue} />
			<ThemeToggle />
			<ProfileCombo session={session} />
		</div>
	)
}