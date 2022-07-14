import React, { useState } from "react";

//TODO: this needs to be stripped out into it's own file for reference such that
//		children components can use UseContext(SettingsContext)

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