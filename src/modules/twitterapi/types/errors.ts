interface Error {
	title: string;
	detail: string;
	type: string;
}

export interface ApiError extends Error {
	errors?: {
		message: string;
		parameters?: {
			username?: string[];
			//TODO: Add remaining api error params
		};
	}[];
}

export interface ResourceError extends Error {
	resource_id: string;
	resource_type: string;
	parameter: string;
	value: string;
}