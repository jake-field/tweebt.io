export interface PublicUserMetrics {
	followers_count?: number;
	following_count?: number;
	tweet_count?: number;
	listed_count?: number; //how many lists a user is on
}

export interface PublicTweetMetrics {
	retweet_count?: number;
	reply_count?: number;
	like_count?: number;
	quote_count?: number;
}