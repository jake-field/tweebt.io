import React, { useEffect, useState } from "react";

//Types
type theme = ('sys' | 'dark' | 'light');

//Utils Function
export function GetDeviceTheme(): theme {
	return (typeof window !== "undefined") ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' : 'light';
}

//State
export class ThemeState {
	theme: theme = 'sys';
	toggle = () => { };
	set = (value: theme) => { };
}

//Initialize state function to make sure the state is correct before the page attempts to render with this information
function intializeState() {
	if (typeof localStorage !== 'undefined') {
		const theme = localStorage['theme'];
		if (theme) {
			console.log('intializeState:', 'theme', '[STORED STATE]');
			return { ...new ThemeState, theme };
		}
	}

	console.log('initalizeState:', 'theme', '[EMPTY STATE]');
	return new ThemeState;
}


//Context
export const ThemeContext = React.createContext(new ThemeState); //default init fine here

//Provider
export default function ThemeProvider({ children }: any) {
	let [state, setState] = useState<ThemeState>(intializeState());

	//context functions
	state.toggle = () => setState({ ...state, theme: (state.theme === 'sys' ? GetDeviceTheme() : state.theme) === 'dark' ? 'light' : 'dark' });
	state.set = (theme: theme) => setState({ ...state, theme });

	//apply theme to DOM on state update
	//TODO: event handler for when the system theme changes
	useEffect(() => {
		if (localStorage['theme'] !== state.theme) {
			console.log('updateStorage:', 'theme', state.theme);
			localStorage['theme'] = state.theme;
		}

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