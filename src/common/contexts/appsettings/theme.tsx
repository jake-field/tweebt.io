import React, { useEffect } from "react";
import useStorageState, { StorageState } from "../utils/storage";

//Types
type theme = ('sys' | 'dark' | 'light');

//Utils Function
export function GetDeviceTheme(): theme {
	return (typeof window !== "undefined") ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' : 'light';
}

//State
export class ThemeState extends StorageState<ThemeState> {
	theme: theme = 'sys';
}

//Context
export const ThemeContext = React.createContext(new ThemeState); //default init fine here

//Provider
export default function ThemeProvider({ children }: any) {
	const [state] = useStorageState('theme', new ThemeState);

	//apply theme to DOM on state update
	//TODO: event handler for when the system theme changes
	useEffect(() => {
		if (state.theme === 'light') document.documentElement.classList.remove('dark');
		else if (state.theme === 'dark') document.documentElement.classList.add('dark');
		else if (state.theme === 'sys' && GetDeviceTheme() === 'dark') document.documentElement.classList.add('dark');
	}, [state.theme]);

	return (
		<ThemeContext.Provider value={state}>
			{children}
		</ThemeContext.Provider>
	)
}