import { LogoutIcon, LoginIcon } from "@heroicons/react/outline";
import { AnnotationIcon, EyeOffIcon, FlagIcon, MoonIcon, UserIcon } from "@heroicons/react/solid";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { ResultsContext } from "../contexts/appsettings/results";
import { GetDeviceTheme, ThemeContext } from "../contexts/appsettings/theme";
import { TileBlurContext } from "../contexts/appsettings/view";
import { ReplyIcon, RetweetIcon } from "../icons/twittericons";
import ToggleSwitch from "./toggleswitch";

interface Props {
	session?: Session;
}

export default function Options({ session }: Props) {
	const liClassName = 'w-full border-b last:border-b-0 border-gray-500 py-3 px-4 hover:bg-slate-500 cursor-pointer';
	const [visible, setVisible] = useState(false);

	return (
		<button
			title={session?.user?.name || 'Not Signed In'}
			className='cursor-pointer flex flex-col gap-1 z-10 bg-slate-100 dark:bg-slate-700 rounded-full sm:pr-3 items-center justify-center text-sm'
			onBlur={() => setVisible(false)}

			//fix for iOS
			onMouseLeave={() => { if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) setVisible(false) }}
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
				className='text-white absolute rounded-lg bg-slate-700 top-11 right-3 font-light'
				style={{ contain: 'content', display: visible ? 'block' : 'none' }}
			>
				<ThemeContext.Consumer>
					{({ theme, set }) =>
						<ToggleSwitch
							label='Dark Mode'
							checked={theme === 'dark' || theme === 'sys' && GetDeviceTheme() === 'dark'}
							className={liClassName}
							onClick={(e) => set({ theme: e.currentTarget.checked ? 'dark' : 'light' })}
						>
							<span className='flex gap-2'><MoonIcon className='w-4' />Dark Mode</span>
						</ToggleSwitch>
					}
				</ThemeContext.Consumer>

				<TileBlurContext.Consumer>
					{({ blur, set }) =>
						<ToggleSwitch
							label='Blur Flagged'
							checked={blur}
							className={liClassName}
							onClick={(e) => set({ blur: e.currentTarget.checked })}
						>
							<span className='flex gap-2'><EyeOffIcon className='w-4' />Blur Flagged</span>
						</ToggleSwitch>
					}
				</TileBlurContext.Consumer>

				<ResultsContext.Consumer>
					{({ feedOptions: { flagged, replies, retweets }, set }) =>
						<div className={liClassName + ' cursor-default'} title='Feed View Options'>
							Show on Feed:
							<div className='flex justify-evenly pt-1'>
								<ToggleSwitch
									label='Display Retweets on Feed'
									className='flex flex-col'
									checked={retweets}
									onClick={(e) => set({ feedOptions: { flagged, replies, retweets: e.currentTarget.checked } })}
								>
									<RetweetIcon className='w-5 text-green-400' />
								</ToggleSwitch>
								<ToggleSwitch
									label='Display Replies on Feed'
									className='flex flex-col'
									checked={replies}
									onClick={(e) => set({ feedOptions: { flagged, replies: e.currentTarget.checked, retweets } })}
								>
									<ReplyIcon className='w-5 text-blue-400' />
								</ToggleSwitch>
								<ToggleSwitch
									label='Display Flagged Tweets on Feed'
									className='flex flex-col'
									checked={flagged}
									onClick={(e) => set({ feedOptions: { flagged: e.currentTarget.checked, replies, retweets } })}
									disabled
								>
									<FlagIcon className='w-5 text-red-400' />
								</ToggleSwitch>
							</div>
						</div>
					}
				</ResultsContext.Consumer>

				<ResultsContext.Consumer>
					{({ profileOptions: { flagged, replies, retweets }, set }) =>
						<div className={liClassName + ' cursor-default'} title='Profile View Options'>
							Show on Profiles:
							<div className='flex justify-evenly pt-1'>
								<ToggleSwitch
									label='Display Retweets on Profiles'
									className='flex flex-col'
									checked={retweets}
									onClick={(e) => set({ profileOptions: { flagged, replies, retweets: e.currentTarget.checked } })}
								>
									<RetweetIcon className='w-5 text-green-400' />
								</ToggleSwitch>
								<ToggleSwitch
									label='Display Replies on Profiles'
									className='flex flex-col'
									checked={replies}
									onClick={(e) => set({ profileOptions: { flagged, replies: e.currentTarget.checked, retweets } })}
								>
									<ReplyIcon className='w-5 text-blue-400' />
								</ToggleSwitch>
								<ToggleSwitch
									label='Display Flagged Tweets on Profiles'
									className='flex flex-col'
									checked={flagged}
									onClick={(e) => set({ profileOptions: { flagged: e.currentTarget.checked, replies, retweets } })}
									disabled
								>
									<FlagIcon className='w-5 text-red-400' />
								</ToggleSwitch>
							</div>
						</div>
					}
				</ResultsContext.Consumer>

				<div
					className={liClassName}
					title={`Sign ${session ? 'Out' : 'In'}`}

					//TODO: disable redirect (currently not because there is no re-render on session logout)
					onClick={() => session ? signOut(/*{ redirect: false }*/) : signIn('twitter')}
				>
					<span className='flex gap-2'>
						{session ? <LogoutIcon className='w-4' /> : <LoginIcon className='w-4' />}
						Sign {session ? 'Out' : 'In'}
					</span>
				</div>
			</div>
		</button>
	)
}