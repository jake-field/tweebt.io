import React, { useEffect, useState } from "react";

export class ResultOptions {
	retweets = true; //[retweets, quotes]
	replies = true; //[replies, self-replies]
	flagged = true;
}

//State
export class ResultsState {
	feedOptions: ResultOptions = new ResultOptions;
	profileOptions: ResultOptions = new ResultOptions;
	searchOptions: ResultOptions = new ResultOptions; //mostly ignored?
	blacklist: (string | undefined) = undefined; //don't show results containing these keyworks or handles [@user, #test, hate] (@user will also automatically filter @/user as well)

	set = (params: Partial<ResultsState>) => { };
}

//Initialize state function to make sure the state is correct before the page attempts to render with this information
function intializeState() {
	if (typeof localStorage !== 'undefined') {
		const tileview = localStorage['results'];
		if (tileview) {
			console.log('intializeState:', 'results', '[STORED STATE]');
			const newState = JSON.parse(tileview) as Partial<ResultsState>;
			return { ...new ResultsState, ...newState };
		}
	}

	console.log('initalizeState:', 'results', '[EMPTY STATE]');
	return new ResultsState;
}

//Context
export const ResultsContext = React.createContext(new ResultsState); //an empty new state here is fine, it'll get updated by the provider

//Provider
export default function ResultsProvider({ children }: any) {
	let [state, setState] = useState<ResultsState>(intializeState()); //initializing here due to useEffect not being activated in time

	//Context functions
	state.set = (params: Partial<ResultsState>) => setState({ ...state, ...params });

	useEffect(() => {
		if (localStorage['results'] === JSON.stringify(state)) return;
		console.log('updateStorage:', 'results', state);
		localStorage['results'] = JSON.stringify(state);
	}, [state]);

	return (
		<ResultsContext.Provider value={state}>
			{children}
		</ResultsContext.Provider>
	)
}