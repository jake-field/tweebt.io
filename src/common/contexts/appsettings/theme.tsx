import { NextPageContext } from "next";
import React, { useEffect } from "react";
import useStorageState, { StorageState } from "../utils/storage";

//Types
type theme = ('sys' | 'dark' | 'light');

//Utils Functions
export function GetDeviceTheme(): theme {
	return (typeof window !== "undefined") ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' : 'light';
}

export function GetClientThemeFromCookies(ctx: NextPageContext): theme {
	const cookies = ctx.req?.headers.cookie;
	const theme = cookies?.match(/tweebt\.theme=(\w*)/i)?.at(1) as (theme | undefined) || 'sys';
	const systheme = cookies?.match(/tweebt\.systheme=(\w*)/i)?.at(1) as (theme | undefined) || 'light'; //Cannot use GetDeviceTheme() as it's clientside code, default to light
	return (theme === 'sys' ? systheme : theme);
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

		//set cookies so server can pre-theme a page
		const cookieparams = '; secure; samesite=lax';
		document.cookie = `tweebt.theme=${state.theme}${cookieparams}`;
		document.cookie = `tweebt.systheme=${GetDeviceTheme()}${cookieparams}`;
	}, [state.theme]);

	return (
		<ThemeContext.Provider value={state}>
			{children}
		</ThemeContext.Provider>
	)
}