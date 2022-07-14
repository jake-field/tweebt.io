import { useEffect, useState } from "react";

export default function SfwToggle() {
	const [mode, setMode] = useState(false);
	const iconStyle = 'absolute transition-opacity ease-in-out duration-300 text-center';

	useEffect(() => {
		if (localStorage.sfw === 'sfw' || (!('sfw' in localStorage))) {
			setSFWMode(true);
		} else {
			setSFWMode(false);
		}
	}, []);

	function setSFWMode(set: boolean) {
		setMode(set);
		localStorage.sfw = set ? 'sfw' : 'nsfw';
	}

	return (
		<a title='Toggle Dark Mode' className='text-center items-center justify-center w-10 h-6 cursor-pointer' onClick={() => setSFWMode(!mode)}>
			<p className={iconStyle} style={{ opacity: mode ? 100 : 0 }}>NSFW</p>
			<p className={iconStyle} style={{ opacity: mode ? 0 : 100 }}>SFW</p>
		</a>
	)
}