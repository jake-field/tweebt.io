export default interface Profile {
	id: string;
	handle: string;
	name: string;
	image: string; //no banner support yet, only profile image
	url?: string;

	//bio array, may be just a single block of text or a split for link replacement, or no bio
	bio?: string | { text?: string, link?: string }[];

	//metrics
	follower_count?: number;
	following_count?: number;
	tweet_count?: number;

	//flags
	protected?: boolean;
	verified?: boolean;
}

export interface ProfileMedia {
	items: ProfileMediaItem[];
	pagination?: ProfileMediaPagination;
}

export interface ProfileMediaItem {
	image: string; //source image or a preview if it is a video
	video?: string; //optional video url (gif or video) [CURRENTLY NOT PROVIDED BY TWITTER API V2]
	tweetid: string; //may not be unique
	author: string;
	width: number;
	height: number;

	flagged?: boolean; //flagged by twitter/author as possibly sensitive
	
	replies?: number;
	retweets?: number;
	likes?: number;
}

export interface ProfileMediaPagination {
	token?: string; //token used for next page
	newest_id?: string; //newest tweet id for scoped pulls
	oldest_id?: string; //oldest tweet id for scoped pulls
}