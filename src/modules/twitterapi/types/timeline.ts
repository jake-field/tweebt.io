import { Error } from './errors';
import { Tweet } from './tweet';

interface Media {
	media_key: string;
	type: string;
	url: string;
	preview_image_url?: string;
	possibly_sensitive?: boolean;
	width: number;
	height: number;
	alt_text?: string;
}

//TODO: figure this one out, we have two, but one is a userReponse
//		maybe make a generic response type?
interface User {
	id: string;
	name: string;
	username: string;
	profile_image_url?: string;
}

export interface Meta {
	result_count: number;
	newest_id?: string;
	oldest_id?: string;
	next_token?: string;
	previous_token?: string;
}

export default interface Timeline {
	data?: Tweet[];
	includes?: {
		media: Media[];
		users?: User[];
		tweets?: Tweet[]; //shell tweets for replies/quotes/retweets
	}
	meta?: Meta;
	errors?: Error[];
}