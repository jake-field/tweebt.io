import React, {  } from "react";
import useStorageState, { StorageState } from "../utils/storage";

export class ResultOptions {
	retweets = true; //[retweets, quotes]
	replies = true; //[replies, self-replies]
	flagged = true;
}

//State
export class ResultsState extends StorageState<ResultsState> {
	feedOptions: ResultOptions = new ResultOptions;
	profileOptions: ResultOptions = new ResultOptions;
	searchOptions: ResultOptions = new ResultOptions; //mostly ignored?
	blacklist: (string | undefined) = undefined; //don't show results containing these keyworks or handles [@user, #test, hate] (@user will also automatically filter @/user as well)
}

//Context
export const ResultsContext = React.createContext(new ResultsState); //an empty new state here is fine, it'll get updated by the provider

//Provider
export default function ResultsProvider({ children }: any) {
	const [state] = useStorageState('results', new ResultsState);

	return (
		<ResultsContext.Provider value={state}>
			{children}
		</ResultsContext.Provider>
	)
}