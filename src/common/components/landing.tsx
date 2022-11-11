'use client';

import { signIn } from "next-auth/react";
import Feed from "../../modules/gallery/components/feed";
import { ProfileData } from "../../modules/profile/types/profile";
import { TwitterIcon } from "../icons/twittericons";
import Searchbar from "./searchbar";

interface Props {
	profile: ProfileData;
}

export default function LandingPage({ profile }: Props) {
	return (
		<div className='flex flex-col items-center justify-center w-screen h-screen fixed overflow-hidden' style={{ contain: "content" }}>
			<div className='demoContainer bg-gradient-to-r' />
			<div className='demoContainer bg-gradient-to-b flex items-center justify-center cursor-default select-none'>
				<div className='demoBanner'>
					<div className='h-[2px] absolute top-0 bg-gradient-to-r from-transparent via-slate-500 w-full' />
					<div className='h-[2px] absolute bottom-0 bg-gradient-to-r from-transparent via-slate-500 w-full' />
					<span className='px-4 relative -top-2'>
						<h1 className='text-6xl px-4 font-thin font-serif pb-1 border-b border-slate-400 dark:border-slate-600'>tweebt</h1>
						<p className='w-full text-center font-thin text-slate-500 dark:text-slate-400' style={{ fontVariant: 'all-small-caps' }}>Mosaic Tweet Gallery</p>
					</span>
					<span className='text-slate-600 dark:text-slate-300'>
						Search by @, #, or topic
					</span>
					<Searchbar route='/' placeholder={`@${profile?.handle}`} />
					<span className='border-t border-slate-400 dark:border-slate-600 px-5 mt-2 pt-2 text-slate-600 dark:text-slate-300 text-sm'>
						Or view your Feed
					</span>
					<span
						title='Sign in with Twitter to view your feed'
						className='cursor-pointer px-2 py-1 rounded-full h-9 bg-sky-500 dark:bg-sky-600 border border-sky-700 shadow-md hover:ring-1 ring-sky-500 text-white flex gap-1 items-center justify-center'
						onClick={() => { signIn('twitter') }}
						style={{ fontVariant: 'all-small-caps' }}
					>
						<p className='h-full'>Log in with Twitter</p>
						<TwitterIcon className='w-5' />
					</span>
				</div>
			</div>
			<div className='relative -top-32 w-full sm:w-3/4 h-[150vh] max-w-[1080px] animate-scrolldemo select-none'>
				<Feed demo profile={profile || undefined} maxResults={50} />
			</div>
		</div>
	)
}