import { Error } from "./errors";

export interface User {
	data?: {
		id: string;
		name: string;
		username: string;
	}
	errors?: Error[];
}