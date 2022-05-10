import { Error } from "./errors";

interface Entities {
	url?: {
		urls?: {
			start: number;
			end: number;
			url: string;
			expanded_url: string;
			display_url: string;
		}[];
	};

	description?: {
		mentions?: {
			start: number;
			end: number;
			username: string;
		}[];
		urls?: {
			start: number;
			end: number;
			url: string;
			expanded_url: string;
			display_url: string;
		}[];
		hashtags?: {
			start: number;
			end: number;
			tag: string;
		}[];
	};
}

export interface User {
	data?: {
		id: string;
		name: string;
		username: string;
		profile_image_url: string;
		description?: string;
		protected?: boolean;
		verified?: boolean;
		entities?: Entities;
	}
	errors?: Error[];
}