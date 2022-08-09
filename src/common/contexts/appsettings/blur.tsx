import React, { useEffect, useState } from "react";

export class BlurState {
	blur = true; //blur by default to prevent mishaps
	toggle = () => { };
	set = (value: boolean) => { };
}

export const BlurContext = React.createContext(new BlurState);

export default function BlurProvider({ children }: any) {
	let [state, setState] = useState<BlurState>(new BlurState);

	//helper function to make things easier
	function mutate(value: boolean) {
		localStorage['blur'] = value;
		setState({
			blur: value,
			toggle: state.toggle,
			set: state.set
		});
	}

	//context functions
	state.toggle = () => mutate(!state.blur);
	state.set = (value: boolean) => mutate(value);

	//Try pull value from localstorage, then update state if needed
	useEffect(() => {
		const val = localStorage['blur'];
		const blur = val ? val === 'true' : state.blur;
		if (val && blur !== state.blur) mutate(blur);
	});

	return (
		<BlurContext.Provider value={state}>
			{children}
		</BlurContext.Provider>
	)
}