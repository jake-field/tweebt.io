import { ExcludeFields, ExpansionFields, MediaFields, PlaceFields, PollFields, TweetFields, UserFields } from "./params.types";

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

export interface UserParams {
	//Optional
	expansions?: ('pinned_tweet_id')[];
	['user.fields']?: UserFields;
	['tweet.fields']?: TweetFields;
}

export interface SearchParams extends BaseTweetParams {
	//Required
	query: string;

	//Optional
	next_token?: string;
}

export interface TimelineParams extends BaseTweetParams {
	//Required

	//Optional
	pagination_token?: string;
	exclude?: ExcludeFields;
}

export default function toQueryString(params: (BaseTweetParams | UserParams | undefined)) {
	return params ? decodeURIComponent(new URLSearchParams(params as any).toString()).replaceAll('#', '%23') : undefined;
}