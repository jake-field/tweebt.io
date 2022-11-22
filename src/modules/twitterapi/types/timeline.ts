import { ResourceError } from './errors';
import { Tweet } from './tweet';

export interface Media {
	media_key: string;
	type: ('photo' | 'animated_gif' | 'video');
	url?: string;
	possibly_sensitive?: boolean;
	width: number;
	height: number;
	alt_text?: string;

	//video/gif variables
	preview_image_url?: string;
	duration_ms?: number;
	variants?: {
		content_type: string;
		url: string;
		bit_rate?: number;
	}[];
	public_metrics?: {
		view_count: number;
	}
}

export interface User {
	id: string;
	name: string;
	username: string;
	protected?: boolean;
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
	errors?: ResourceError[];
}