'use client';

import { signIn } from "next-auth/react";
import Feed from "../../modules/gallery/components/feed";
import { ProfileData } from "../../modules/profile/types/profile";
import Searchbar from "./searchbar";

interface Props {
	profile: ProfileData;
}

export default function LandingPage({ profile }: Props) {
	return (
		<div className='flex flex-col items-center justify-center w-screen h-screen fixed overflow-hidden' style={{ contain: "content" }}>
			<div className='demoContainer bg-gradient-to-r' />
			<div className='demoContainer bg-gradient-to-b flex items-center justify-center'>
				<div className='demoBanner'>
					<span className='px-4 pb-2 rounded-lg bg-slate-100 dark:bg-slate-800'>
						<h1 className='text-6xl font-thin pb-1 border-b border-slate-400 dark:border-slate-600'>tweebt</h1>
						<p className='w-full text-center text-slate-500 dark:text-slate-400'>Mosaic Tweet Gallery</p>
					</span>
					<span>
						Search by @, #, or topic:
					</span>
					<Searchbar route='/' placeholder={`@${profile?.handle}`} />
					<span>
						<a title='Sign in with Twitter to view your feed' onClick={() => { signIn('twitter') }}>Or sign in with Twitter to view your feed</a>
					</span>
				</div>
			</div>
			<div className='relative -top-32 w-full sm:w-3/4 h-[150vh] max-w-[1080px] animate-scrolldemo'>
				<Feed demo profile={profile || undefined} maxResults={50} />
			</div>
		</div>
	)
}