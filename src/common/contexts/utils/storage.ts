import { Dispatch, SetStateAction, useEffect, useState } from "react";

/**
 * Base class to include a generic setter function to any class that needs it
 */
export class StorageState<T> {
	set = (params: Partial<T>) => { };
}

/**
 * Attempt to load the state from local storage using `key` for the key-value pair as a JSON Object.
 * `defaultValue` is used as the base for the import, as well as the return value if no key-pair
 * exists. If `rawValue = true`, the value will be imported as is, instead of being treated as a JSON Object.
 */
function initStateFromStorage<T>(key: string, defaultValue: T): T {
	try {
		//Client-side check, localStorage will be undefined on the server
		if (typeof localStorage !== 'undefined') {
			const val = localStorage[key]; //attempt to pull key-value pair
			if (val) return ({ ...defaultValue, ...(JSON.parse(val) as Partial<T>) });
		}
	} catch (err) {
		console.log('initStateFromStorage() error:', err);
	}

	//Return default value
	return (defaultValue);
}

/**
 * Hook for having state that is directly linked to the browser's local storage
 * @param key - Key used for key-value pair in browser local storage
 * @param defaultValue - Default typed value for this state, this will be overriden by anything in local storage
 */
export default function useStorageState<T>(key: string, defaultValue: T): [T, Dispatch<SetStateAction<T>>] {
	const [state, setState] = useState(initStateFromStorage(key, defaultValue));

	//Dirty force of set function
	//TODO: use a wrapper class maybe
	(state as unknown as StorageState<T>).set = (params: Partial<T>) => setState({ ...state, ...params });

	//Update storage on state update, this helps if there are custom functions
	useEffect(() => {
		localStorage[key] = JSON.stringify(state); //TODO: sanitize
		console.log(state);
	}, [state, key]);

	return [state, setState];
}