import { HomeIcon, UserIcon } from '@heroicons/react/solid';
import { Session } from 'next-auth';
import { signIn, signOut } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import Searchbar from './searchbar';
import SfwToggle from './sfwtoggle';
import ThemeToggle from './themetoggle';

interface Props {
	searchValue?: string;
	session?: Session;
}

export default function NavBar({ searchValue, session }: Props) {
	return (
		<div className='fixed z-40 select-none p-3 flex flex-row flex-wrap items-center justify-center gap-2 w-full bg-slate-200 dark:bg-slate-900 border-b border-slate-400 dark:border-slate-800' >
			<span className='text-xl text-slate-700 dark:text-slate-300 border-l border-r px-3 border-slate-500 hidden sm:block'>
				<Link href='/' title='tweebt'>tweebt</Link>
			</span>

			<nav className='flex flex-row items-center sm:px-3 py-1 gap-3 sm:grow'>
				<Link title='Home' className='flex items-center gap-1' href='/'>
					<a title='Home'><HomeIcon className='w-6' /></a>
				</Link>
				{session ? (
					<Link title='Profile' className='flex items-center gap-1' href={`/@${session?.user?.email}`}>
						<a title='Profile'><UserIcon className='w-6' /></a>
					</Link>
				) : (
					<a title='Sign In' className='items-center gap-1 hidden sm:flex' onClick={() => signIn('twitter')}>
						<UserIcon className='w-6' />
					</a>
				)}
				{/* <a title='Search' className='flex items-center gap-1'>
					<SearchIcon className='w-6' />
				</a> */}
			</nav>

			<span className='sm:absolute'>
				<Searchbar route='/' placeholder='Search by @, # or topic' value={searchValue} />
			</span>

			<div className='gap-3 items-center hidden sm:flex'>
				<SfwToggle />
				<ThemeToggle />

				{/* <a title='Settings' className='cursor-pointer'>
					<CogIcon className='w-6' />
				</a> */}
			</div>

			<div className='flex gap-3 items-center'>
				{session?.user ? (
					<span
						title={session.user.name!}
						className='cursor-pointer flex gap-1 bg-slate-100 dark:bg-slate-700 rounded-full sm:pr-3 items-center justify-center text-sm'
						onClick={() => signOut()}
					>
						<Image className='rounded-full' src={session.user.image!} width='28' height='28' unoptimized={true} />
						<span className='hidden sm:block'>@{session.user.email}</span>
					</span>
				) : (
					<a
						title='Sign In'
						className='flex gap-2 bg-slate-100 dark:bg-slate-700 rounded-full sm:pr-3 items-center justify-center text-sm'
						onClick={() => signIn('twitter')}
					>
						<UserIcon className='w-7 bg-gray-300 fill-gray-500 dark:bg-gray-400 dark:fill-gray-700 rounded-full p-1' />
						<span className='hidden sm:block'>Sign In</span>
					</a>
				)}
			</div>
		</div>
	)
}