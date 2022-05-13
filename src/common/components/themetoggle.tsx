import { MoonIcon, SunIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
	const [darkTheme, setDarkTheme] = useState(false);
	const iconStyle = 'w-6 absolute shadow-lg transition-opacity ease-in-out duration-300';

	useEffect(() => {
		if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
			setTheme(true);
		} else {
			setTheme(false);
		}
	}, []);

	function setTheme(dark: boolean) {
		setDarkTheme(dark);
		if (dark) document.documentElement.classList.add('dark');
		else document.documentElement.classList.remove('dark');
		localStorage.theme = dark ? 'dark' : 'light';
	}

	return (
		<>
			<span className='flex flex-row items-center justify-center ml-1 w-8 h-8 p-1 bg-slate-300 dark:bg-slate-700 rounded-lg hover:ring-1 cursor-pointer' onClick={() => setTheme(!darkTheme)}>
				<SunIcon className={iconStyle + ' text-white'} style={{ opacity: darkTheme ? 100 : 0 }} />
				<MoonIcon className={iconStyle + ' text-slate-900'} style={{ opacity: darkTheme ? 0 : 100 }} />
			</span>
		</>
	)
}