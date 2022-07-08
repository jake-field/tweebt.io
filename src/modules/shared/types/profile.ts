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