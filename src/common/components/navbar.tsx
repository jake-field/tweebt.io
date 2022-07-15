import { LoginIcon } from "@heroicons/react/outline";
import { CogIcon, HomeIcon, SearchIcon, UserIcon } from "@heroicons/react/solid";
import { Session } from "next-auth";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Searchbar from "./searchbar";
import SfwToggle from "./sfwtoggle";
import ThemeToggle from "./themetoggle";

interface Props {
	searchValue?: string;
	session?: Session;
}

export default function NavBar({ searchValue, session }: Props) {
	return (
		<div className='fixed z-40 select-none p-3 flex flex-row items-center justify-center gap-2 w-full bg-slate-200 dark:bg-slate-900 border-b border-slate-400 dark:border-slate-800' >
			<a className='text-xl text-slate-700 dark:text-slate-300 border-l border-r px-3 border-slate-500' href="/">tweebt</a>

			<nav className='flex flex-row items-center px-3 py-1 gap-3 grow'>
				<a title='Home' className='flex items-center gap-1' href='/'>
					<HomeIcon className='w-6' />
				</a>
				<a title='Profile' className='flex items-center gap-1' href={`/${session?.user?.id}`}>
					<UserIcon className='w-6' />
				</a>
				<a title='Search' className='flex items-center gap-1'>
					<SearchIcon className='w-6' />
				</a>
			</nav>

			<span className='absolute'>
				<Searchbar route='/' placeholder='Search by @, # or topic' value={searchValue} />
			</span>

			<div className='flex gap-3 items-center'>
				<SfwToggle />
				<ThemeToggle />
				<a title='Settings' className='cursor-pointer'><CogIcon className='w-6' /></a>
				{session?.user ? (
					<a title={session.user.name!} className='cursor-pointer flex'>
						<Image className='rounded-full' src={session.user.image!} width='24' height='24' />
					</a>
				) : (
					<a title='Sign In' className='cursor-pointer' onClick={() => signIn('twitter')}>
						<LoginIcon className='w-6' />
					</a>
				)}
			</div>
		</div>
	)
}