import { MoonIcon, SunIcon } from '@heroicons/react/solid';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
	const [darkTheme, setDarkTheme] = useState(false);
	const iconStyle = 'w-6 absolute transition-opacity ease-in-out duration-300';

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
		<a title='Toggle Dark Mode' className='items-center justify-center w-6 h-6 cursor-pointer' onClick={() => setTheme(!darkTheme)}>
			<SunIcon className={iconStyle} style={{ opacity: darkTheme ? 100 : 0 }} />
			<MoonIcon className={iconStyle} style={{ opacity: darkTheme ? 0 : 100 }} />
		</a>
	)
}