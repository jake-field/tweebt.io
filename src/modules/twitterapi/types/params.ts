import { ExcludeFields, ExpansionFields, MediaFields, PlaceFields, PollFields, TweetFields, UserFields } from './params.types';

/**
 * Core interface for requesting Tweets from the Twitter API (v2).
 * Every request type will use these base options.
 * 
 * @param start_time `[opt]` - Time/Date in past to retrieve Tweets after
 * @param end_time `[opt]` - Time/Date to retrieve Tweets before
 * @param since_id `[opt]` - Retrieve Tweets posted since a Tweet ID
 * @param until_id `[opt]` - Retrieve Tweets posted before a Tweet ID
 * @param max_results `[opt]` - Maximum amount Tweets to retrieve between [10 - 100], may return less
 * @param expansions `[opt]` - Request expansion of a Tweet sub object
 * @param user.fields `[opt]` - Request expansion of a user profile object
 * @param tweet.fields `[opt]` - Request expansion of a Tweet object
 * @param media.fields `[opt]` - Request expansion of a media object
 * @param place.fields `[opt]` - Request expansion of a geolocation object
 * @param poll.fields `[opt]` - Request expansion of a poll object
 */
export interface BaseTweetParams {
	//Required

	//Optional
	start_time?: string;
	end_time?: string;
	since_id?: number;
	until_id?: number;
	max_results?: number; //10-100; defaults to 10 if undefined

	//Optional fields
	expansions?: ExpansionFields;
	['user.fields']?: UserFields;
	['tweet.fields']?: TweetFields;
	['media.fields']?: MediaFields;
	['place.fields']?: PlaceFields;
	['poll.fields']?: PollFields;
}

/**
 * Optional params used when requesting a user profile.
 * 
 * @param expansions `[opt]` - Request the pinned Tweet ID on the user's profile
 * @param user.fields `[opt]` - Request expansion of profile information/features
 * @param tweet.fields `[opt]` - Request expansion of pinned Tweet object
 *
 */
export interface UserParams {
	//Optional
	expansions?: ('pinned_tweet_id')[];
	['user.fields']?: UserFields;
	['tweet.fields']?: TweetFields;
}

/**
 * Required params for searching using the Twitter API (v2).
 * Request will return up to 3200 individual Tweets (up to 12,800 images [3200*4]).
 * 
 * @extends BaseTweetParams
 * 
 * @param query Query to search for
 * @param next_token `[opt]` - Pagination token for retrieving next results
 * 
 */
export interface SearchParams extends BaseTweetParams {
	//Required
	query: string;

	//Optional
	next_token?: string;
}

/**
 * Required params for requesting Timelines using the Twitter API (v2).
 * Request will return up to 3200 individual Tweets (up to 12,800 images), however,
 * requesting with `exclude` containing `replies` will only yield up to 800 individual Tweets (3200 images [800*4]).
 * 
 * @extends BaseTweetParams
 * 
 * @param pagination_token `[opt]` - Pagination token for retrieving next results
 * @param exclude `[opt]` - Exclude retweets/replies from results
 * 
 */
export interface TimelineParams extends BaseTweetParams {
	//Required

	//Optional
	pagination_token?: string;
	exclude?: ExcludeFields;
}

/**
 * Helper function that returns a query string from a configured params interface
 * @param params `UserParams`, `SearchParams` or `TimelineParams`, can be `undefined` or `BaseTweetParams`
 * @returns {string|undefined} A usable query string for URLs or `undefined` if `params` isn't valid
 */
export default function toQueryString(params: (BaseTweetParams | UserParams | undefined)): (string | undefined) {
	return params ? decodeURIComponent(new URLSearchParams(params as any).toString()).replaceAll('#', '%23') : undefined;
}