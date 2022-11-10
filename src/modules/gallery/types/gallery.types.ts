export interface Error {
	title: string;
	detail: string;
}

export interface Author {
	id: string;
	handle: string;
	name: string;
	image: string;
}

export interface Metrics {
	retweets: number;
	replies: number;
	likes: number;
	quotes: number;
}

export interface Tweet {
	id: string;
	type?: ('retweeted' | 'replied_to' | 'quoted'); //used by ref_tweets

	author: Author;
	metrics?: Metrics;
	text?: string;
	created_at: string;
	created_at_short?: string;
}

//TODO: Rename this once cleanup is complete
export interface Media {
	id: string;
	type: string; //image, video, animated_gif

	tweet: Tweet;
	ref_tweet?: Tweet; //optional, may not reference a tweet

	url: string; //image url or video preview

	width: number;
	height: number;

	alt_text?: string; //optional, may contain alternative text
	flagged?: boolean; //optional, may be flagged by author/twitter as potentially sensitive

	//video stuff
	video_url?: string;
	videolq_url?: string;
	duration_ms?: number;
	view_count?: number;
}