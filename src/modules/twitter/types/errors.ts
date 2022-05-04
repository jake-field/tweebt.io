export interface ApiError {
	title: string;
	detail: string;
	type: string;
	errors?: {
		message: string;
		parameters?: {
			username?: string[];
		};
	}[];
}

export interface Error {
	value: string;
	detail: string;
	title: string;
	resource_type: string;
	parameter: string;
	resource_id: string;
	type: string;
}