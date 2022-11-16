'use client';

import { HomeIcon, UserIcon } from '@heroicons/react/24/solid';
import { Session } from 'next-auth';
import { signIn } from 'next-auth/react';
import Options from './options';
import Searchbar from './searchbar';

interface Props {
	session?: Session;
	searchBarValue?: string;
}

export default function NavBar({ session, searchBarValue }: Props) {
	return (
		<>
			<div className='fixed z-40 select-none p-3 flex flex-row flex-wrap items-center justify-center gap-2 w-full bg-slate-200 dark:bg-slate-900 border-b border-slate-400 dark:border-slate-800' >
				<span className='text-xl text-slate-700 dark:text-slate-300 border-l border-r px-3 border-slate-500 hidden sm:block'>
					<a href='/' title='tweebt'>
						tweebt
					</a>
				</span>

				<nav className='flex flex-row items-center sm:px-3 py-1 gap-3 sm:grow'>
					<a className='flex items-center gap-1' href='/' title='Home Feed'>
						<HomeIcon className='w-6' />
					</a>
					{session ? (
						<a className='flex items-center gap-1' href={`/@${session?.user?.email}`} title={`Profile (@${session.user?.email})`}>
							<UserIcon className='w-6' />
						</a>
					) : (
						<a title='Sign In' className='items-center gap-1 hidden sm:flex' onClick={() => signIn('twitter', { callbackUrl: '/me' })}>
							<UserIcon className='w-6' />
						</a>
					)}
				</nav>

				<span className='sm:absolute'>
					<Searchbar route='/' placeholder='Search by @, # or topic' value={searchBarValue} />
				</span>

				<Options />
			</div>
			<div className='h-20' />
		</>
	)
}