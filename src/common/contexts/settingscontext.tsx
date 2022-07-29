import React, { useState } from 'react';

//TODO: Settings becomes the main component which includes all the individual contexts for App
//	Things like NSFW blur should have access to the localstorage for it's type
//	Visuals are per-device, so they can be unified between mobile/pc, such as always show overlay etc. or top&bottom vs. bottom display
//  Possibly worth putting a theme context, even though it's handled internally by tailwind
//	Filters will most likely have to be fetch only, so force a page refresh

export class Settings {
	blursensitive = false;
	toggleblur = () => { };
}

export const SettingsContext = React.createContext(new Settings);

export default function SettingsProvider({ children }: any) {
	let [settings, setSettings] = useState<Settings>(new Settings);

	settings.toggleblur = () => {
		setSettings({
			blursensitive: !settings.blursensitive,
			toggleblur: settings.toggleblur
		});
	}

	return (
		<SettingsContext.Provider value={settings}>
			{children}
		</SettingsContext.Provider>
	)
}