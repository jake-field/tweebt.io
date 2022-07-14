import { Meta } from "../../twitterapi/types/timeline";

export interface Author {
	id: string;
	username: string;
	name: string;
}

export interface Media {
	key: string;
	tweet_id: string;
	author: Author;
	referencing?: {
		type: 'retweeted' | 'replied_to' | 'quoted';
		id: string;
		username:string;
	}[]

	type: string;
	url: string;
	width: number;
	height: number;
	nsfw?: boolean;

	//tweet text
	text?: string;

	metrics: {
		retweets: number;
		replies: number;
		likes: number;
		quotes: number;
	}
}


export default interface Gallery {
	meta?: Meta,
	items: Media[]
}