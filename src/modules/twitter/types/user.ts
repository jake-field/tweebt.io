import { Error } from "./errors";

export interface User {
	data?: {
		id: string;
		name: string;
		username: string;
		profile_image_url: string;
		description?: string;
		url?:string;
		protected?: boolean;
	}
	errors?: Error[];
}