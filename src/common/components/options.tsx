import { LogoutIcon, LoginIcon } from "@heroicons/react/outline";
import { EyeOffIcon, MoonIcon, UserIcon } from "@heroicons/react/solid";
import { Session } from "next-auth";
import { signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { BlurContext } from "../contexts/appsettings/blur";
import { GetDeviceTheme, ThemeContext } from "../contexts/appsettings/theme";
import ToggleSwitch from "./toggleswitch";

interface Props {
	session?: Session;
}

export default function Options({ session }: Props) {
	const liClassName = 'w-full border-b last:border-b-0 border-gray-500 py-1 px-3 hover:bg-slate-500 cursor-pointer';
	const [visible, setVisible] = useState(false);

	return (
		<button
			title={session?.user?.name || 'Not Signed In'}
			className='cursor-pointer flex flex-col gap-1 z-10 bg-slate-100 dark:bg-slate-700 rounded-full sm:pr-3 items-center justify-center text-sm'
			onBlur={() => setVisible(false)}

			//fix for iOS?
			//onPointerOut={() => { if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) setVisible(false) }}
			onMouseOut={() => { if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) setVisible(false) }}
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
				className='text-white absolute rounded-lg bg-slate-700 top-11 right-3 font-light py-1'
				style={{ contain: 'content', display: visible ? 'block' : 'none' }}
			>
				<ThemeContext.Consumer>
					{settings =>
						<ToggleSwitch
							label='Dark Mode'
							checked={settings.theme === 'dark' || settings.theme === 'sys' && GetDeviceTheme() === 'dark'}
							className={liClassName}
							onClick={(e) => settings.set(e.currentTarget.checked ? 'dark' : 'light')}
						>
							<span className='flex gap-1'><MoonIcon className='w-4' />Dark Mode</span>
						</ToggleSwitch>
					}
				</ThemeContext.Consumer>

				<BlurContext.Consumer>
					{opt =>
						<ToggleSwitch
							label='Blur Flagged'
							checked={opt.blur}
							className={liClassName}
							onClick={(e) => opt.set(e.currentTarget.checked)}
						>
							<span className='flex gap-1'><EyeOffIcon className='w-4' />Blur Flagged</span>
						</ToggleSwitch>
					}
				</BlurContext.Consumer>

				<div
					className={liClassName}
					title={`Sign ${session ? 'Out' : 'In'}`}

					//TODO: disable redirect (currently not because there is no re-render on session logout)
					onClick={() => session ? signOut(/*{ redirect: false }*/) : signIn('twitter')}
				>
					<span className='flex gap-1'>
						{session ? <LogoutIcon className='w-4' /> : <LoginIcon className='w-4' />}
						Sign {session ? 'Out' : 'In'}
					</span>
				</div>
			</div>
		</button>
	)
}