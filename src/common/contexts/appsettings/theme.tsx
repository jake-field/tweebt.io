import React, { useEffect, useState } from "react";

type theme = ('sys' | 'dark' | 'light');

export class ThemeState {
	theme: theme = 'sys';
	toggle = () => { };
	set = (value: theme) => { };
}

export const ThemeContext = React.createContext(new ThemeState);

export default function ThemeProvider({ children }: any) {
	const sysTheme: theme = (typeof window !== "undefined") ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light' : 'light';
	let [state, setState] = useState<ThemeState>(new ThemeState);

	//helper function to make things easier
	function mutate(value: theme) {
		localStorage['theme'] = value;
		setState({
			theme: value,
			toggle: state.toggle,
			set: state.set
		});
	}

	function invertTheme(theme: theme) {
		return (theme === 'sys' ? sysTheme : theme) === 'dark' ? 'light' : 'dark';
	}

	//context functions
	state.toggle = () => mutate(invertTheme(state.theme));
	state.set = (value: theme) => mutate(value);

	//Try pull value from localstorage, then update state if needed
	useEffect(() => {
		const val = localStorage['theme'];
		const theme = val ? val : state.theme;
		if (val && theme !== state.theme) mutate(theme);
	});

	//apply theme to DOM on state update
	useEffect(() => {
		if (state.theme === 'light') document.documentElement.classList.remove('dark');
		else if (state.theme === 'dark') document.documentElement.classList.add('dark');
		else if (state.theme === 'sys' && sysTheme === 'dark') document.documentElement.classList.add('dark');
	}, [state.theme, sysTheme]);

	return (
		<ThemeContext.Provider value={state}>
			{children}
		</ThemeContext.Provider>
	)
}