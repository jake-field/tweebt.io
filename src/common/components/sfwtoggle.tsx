import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "../contexts/settingscontext";

export default function SfwToggle() {
	const settingsContext = useContext(SettingsContext);
	const [mode, setMode] = useState(false);
	const iconStyle = 'absolute transition-opacity ease-in-out duration-300';

	useEffect(() => {
		setSFWMode(localStorage.sfw === 'sfw' || (!('sfw' in localStorage)));
	}, []);

	function setSFWMode(set: boolean) {
		setMode(set);
		localStorage.sfw = set ? 'sfw' : 'nsfw';
		settingsContext.toggleblur();
	}

	return (
		<a title='Toggle Dark Mode' className='flex items-center justify-end w-10 h-6 cursor-pointer' onClick={() => setSFWMode(!mode)}>
			<p className={iconStyle} style={{ opacity: mode ? 100 : 0 }}>NSFW</p>
			<p className={iconStyle} style={{ opacity: mode ? 0 : 100 }}>SFW</p>
		</a>
	)
}