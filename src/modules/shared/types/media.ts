export default interface Media {
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