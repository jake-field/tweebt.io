'use client';

import { ArrowLeftOnRectangleIcon, ArrowRightOnRectangleIcon, FilmIcon, FlagIcon } from "@heroicons/react/24/outline";
import { EyeSlashIcon, GifIcon, MoonIcon, SpeakerWaveIcon, UserIcon } from "@heroicons/react/24/solid";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ResultsContext } from "../contexts/appsettings/results";
import { getDeviceTheme, ThemeContext } from "../contexts/appsettings/theme";
import { TileBlurContext, TileViewContext } from "../contexts/appsettings/view";
import { ReplyIcon, RetweetIcon } from "../icons/twittericons";
import ToggleSwitch from "./toggleswitch";

export default function Options() {
	const pathname = usePathname();
	const { data: session } = useSession();
	const [visible, setVisible] = useState(false);
	const [disableMuteOption, setDisableMuteOption] = useState(false);

	const liClassName = 'w-max sm-h:landscape:min-w-full portrait:min-w-full landscape:border-r sm-h:landscape:border-r-0 sm-h:landscape:border-b last:border-b-0 border-slate-300 dark:border-slate-500 py-3 px-4 hover:bg-slate-200 hover:dark:bg-slate-500 cursor-pointer';
	const isAppleTouchDevice = (typeof navigator !== "undefined") && (/iPhone|iPad|iPod/gi.test(navigator.userAgent) || (/AppleWebKit/gi.test(navigator.userAgent) && navigator.maxTouchPoints > 0));
	const touchScreenMode = (typeof window !== "undefined") && window.matchMedia('(any-pointer: coarse)').matches;

	useEffect(() => {
		setDisableMuteOption(isAppleTouchDevice || touchScreenMode);
	}, [isAppleTouchDevice, touchScreenMode]);

	function handleSignInAndOut() {
		if (session) {
			signOut({ redirect: pathname === '/' }); //Only redirect when logging out on your feed
			setVisible(false);
		} else {
			signIn('twitter');
		}
	}

	return (
		<>
			<button
				title={session?.user?.name || 'Not Signed In'}
				className='cursor-pointer flex flex-col gap-1 z-10 bg-slate-100 dark:bg-slate-700 rounded-full sm:pr-3 items-center justify-center text-sm'
				onBlur={() => setVisible(false)}

				//fix for iOS
				onMouseLeave={() => { if (isAppleTouchDevice) setVisible(false) }}
			>
				<span className='flex justify-center items-center gap-1' onClick={() => setVisible(!visible)}>
					{session?.user ? (
						<>
							<Image className='rounded-full' src={session.user.image!} alt={`@${session.user.email}`} width='28' height='28' />
							<span className='hidden sm:block'>@{session.user.email}</span>
						</>
					) : (
						<>
							<UserIcon className='w-7 bg-gray-300 fill-gray-500 dark:bg-gray-400 dark:fill-gray-700 rounded-full p-1' />
							<span className='hidden sm:block'>Not Signed In</span>
						</>
					)}
				</span>

				<div
					className={`text-slate-900 dark:text-slate-100 flex-row sm-h:landscape:flex-col portrait:flex-col absolute rounded-lg bg-slate-100 dark:bg-slate-700 top-11 right-3 font-light border border-slate-400 dark:border-slate-500`}
					style={{ contain: 'content', display: visible ? 'flex' : 'none' }}
				>
					<div className='flex flex-col w-max sm-h:landscape:border-b portrait:border-b border-slate-300 dark:border-slate-500' style={{ height: 'unset' }}>
						<ThemeContext.Consumer>
							{({ theme, set }) =>
								<ToggleSwitch
									label='Toggle dark mode'
									checked={theme === 'dark' || theme === 'sys' && getDeviceTheme() === 'dark'}
									className={liClassName + ' justify-between min-w-full h-full border-b'}
									onClick={(e) => set({ theme: e.currentTarget.checked ? 'dark' : 'light' })}
								>
									<span className='flex gap-2'><MoonIcon className='w-4' />Dark Mode</span>
								</ToggleSwitch>
							}
						</ThemeContext.Consumer>

						<TileBlurContext.Consumer>
							{({ blur, set }) =>
								<ToggleSwitch
									label='Blur flagged media'
									checked={blur}
									className={liClassName + ' justify-between min-w-full h-full'}
									onClick={(e) => set({ blur: e.currentTarget.checked })}
								>
									<span className='flex gap-2'><EyeSlashIcon className='w-4' />Blur Flagged</span>
								</ToggleSwitch>
							}
						</TileBlurContext.Consumer>
					</div>


					<TileViewContext.Consumer>
						{({ autoplayVideos, unmuteVideoOnHover, autoplayGifs, set }) =>
							<div className={liClassName + ' cursor-default'} title='Feed Autoplay Options'>
								Autoplay:
								<div className='flex justify-evenly pt-1 gap-1'>
									<ToggleSwitch
										label='Autoplay gifs on your feed'
										checked={autoplayGifs}
										className='flex flex-col justify-between'
										onClick={(e) => set({ autoplayGifs: e.currentTarget.checked })}
									>
										<GifIcon className='w-5' />
									</ToggleSwitch>
									<ToggleSwitch
										label='Autoplay videos on your feed (Muted by default)'
										checked={autoplayVideos}
										className='flex flex-col justify-between'
										onClick={(e) => set({ autoplayVideos: e.currentTarget.checked })}
									>
										<FilmIcon className='w-5' />
									</ToggleSwitch>
									<ToggleSwitch
										label='Unmute videos with audio when you hover over them'
										checked={unmuteVideoOnHover}
										disabled={disableMuteOption}
										className='flex flex-col justify-between'
										onClick={(e) => set({ unmuteVideoOnHover: e.currentTarget.checked })}
									>
										<SpeakerWaveIcon className='w-5' />
									</ToggleSwitch>
								</div>
							</div>
						}
					</TileViewContext.Consumer>

					<ResultsContext.Consumer>
						{({ feedOptions: { flagged: feedFlagged, replies: feedReplies, retweets: feedRetweets },
							profileOptions: { flagged: profileFlagged, replies: profileReplies, retweets: profileRetweets }, set }) =>
							<>
								<div className={liClassName + ' cursor-default'} title='Feed View Options'>
									Show on Feed:
									<div className='flex justify-evenly pt-1 gap-1'>
										<ToggleSwitch
											label='Display Retweets on Feed'
											className='flex flex-col justify-between'
											checked={feedRetweets}
											onClick={(e) => set({ feedOptions: { flagged: feedFlagged, replies: feedReplies, retweets: e.currentTarget.checked } })}
										>
											<RetweetIcon className='w-5 text-green-500' />
										</ToggleSwitch>
										<ToggleSwitch
											label='Display Replies on Feed'
											className='flex flex-col justify-between'
											checked={feedReplies}
											onClick={(e) => set({ feedOptions: { flagged: feedFlagged, replies: e.currentTarget.checked, retweets: feedRetweets } })}
										>
											<ReplyIcon className='w-5 text-blue-400' />
										</ToggleSwitch>
										<ToggleSwitch
											label='Display Flagged Tweets on Feed'
											className='flex flex-col justify-between'
											checked={feedFlagged}
											onClick={(e) => set({ feedOptions: { flagged: e.currentTarget.checked, replies: feedReplies, retweets: feedRetweets } })}
											disabled
										>
											<FlagIcon className='w-5 text-red-400' />
										</ToggleSwitch>
									</div>
								</div>

								<div className={liClassName + ' cursor-default'} title='Profile View Options'>
									Show on Profiles:
									<div className='flex justify-evenly pt-1 gap-1'>
										<ToggleSwitch
											label='Display Retweets on Profiles'
											className='flex flex-col justify-between'
											checked={profileRetweets}
											onClick={(e) => set({ profileOptions: { flagged: profileFlagged, replies: profileReplies, retweets: e.currentTarget.checked } })}
										>
											<RetweetIcon className='w-5 text-green-500' />
										</ToggleSwitch>
										<ToggleSwitch
											label='Display Replies on Profiles'
											className='flex flex-col justify-between'
											checked={profileReplies}
											onClick={(e) => set({ profileOptions: { flagged: profileFlagged, replies: e.currentTarget.checked, retweets: profileRetweets } })}
										>
											<ReplyIcon className='w-5 text-blue-400' />
										</ToggleSwitch>
										<ToggleSwitch
											label='Display Flagged Tweets on Profiles'
											className='flex flex-col justify-between'
											checked={profileFlagged}
											onClick={(e) => set({ profileOptions: { flagged: e.currentTarget.checked, replies: profileReplies, retweets: profileRetweets } })}
											disabled
										>
											<FlagIcon className='w-5 text-red-400' />
										</ToggleSwitch>
									</div>
								</div>
							</>
						}
					</ResultsContext.Consumer>

					<div
						className={liClassName}
						title={`Sign ${session ? 'Out' : 'In'}`}
						onClick={() => handleSignInAndOut()}
					>
						<span className='flex items-center justify-center gap-2 w-full h-full'>
							{session ? <ArrowRightOnRectangleIcon className='w-5' /> : <ArrowLeftOnRectangleIcon className='w-5' />}
							Sign {session ? 'Out' : 'In'}
						</span>
					</div>
				</div>
			</button>
		</>
	)
}