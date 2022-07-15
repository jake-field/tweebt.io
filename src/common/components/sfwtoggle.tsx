import { useContext, useEffect, useState } from "react";
import { SettingsContext } from "../contexts/settingscontext";

export default function SfwToggle() {
	const settingsContext = useContext(SettingsContext);
	const [sfw, setSFW] = useState(false);
	const iconStyle = 'absolute transition-opacity ease-in-out duration-300';

	useEffect(() => {
		setSFWMode(localStorage.sfw === 'sfw' || (!('sfw' in localStorage)));
	}, []);

	function setSFWMode(set: boolean) {
		setSFW(set);
		localStorage.sfw = set ? 'sfw' : 'nsfw';

		//fix for toggle being wrong
		if(settingsContext.blursensitive !== set) settingsContext.toggleblur();
	}

	return (
		<a title='Toggle Dark Mode' className='flex items-center justify-end w-10 h-6 cursor-pointer' onClick={() => setSFWMode(!sfw)}>
			<p className={iconStyle} style={{ opacity: sfw ? 0 : 100 }}>NSFW</p>
			<p className={iconStyle} style={{ opacity: sfw ? 100 : 0 }}>SFW</p>
		</a>
	)
}