import React, { useState } from "react";

export class BlurState {
	blur = true;
	toggle = () => { };
	set = (value: boolean) => { };
}

export const BlurContext = React.createContext(new BlurState);

export default function BlurProvider({ children }: any) {
	let [state, setState] = useState<BlurState>(new BlurState);

	state.toggle = () => {
		setState({
			blur: !state.blur,
			toggle: state.toggle,
			set: state.set
		});
	};

	state.set = (value: boolean) => {
		setState({
			blur: value,
			toggle: state.toggle,
			set: state.set
		});
	};

	return (
		<BlurContext.Provider value={state} children={children} />
	)
}