//Imports
import { isValidHandle } from 'common/utils/regextests';
import Profile from 'modules/profile/types/profile';
import toQueryString, { SearchParams, TimelineParams, UserParams } from './types/params';
import UserProfileResponse from './types/user';

//Base url for Twitter's API
const baseUrl = 'https://api.twitter.com';

/**
 * Fetch wrapper to attach bearer token to each request
 * 
 * @param url Url to fetch
 * @param token App or User auth token
 * @param params Params to append to URL
 * @returns Fetch promise
 */
async function callApi(url: string, token: string, params?: string) {
	const header: RequestInit = {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`, //applies to both App token and User token for Twitter
			'Content-Type': 'application/json',
		}
	};

	return fetch(`${baseUrl}${url}` + (params && `?${params}`), header);
}

/**
 * Container for Twitter API calls/interactions
 * 
 * @function `getProfileByID()` - Get user profile by permanent ID
 * @function `getProfileByHandle()` - Get user profile by \@handle
 * @function `getMyFeed()` - Get logged in user's timeline/home
 * @function `getUsersTweets()` - Get user's tweets
 * @function `getSearchResults()` - Get search results by query
 * 
 */
export const TwitterEndpoints = {
	/**
	 * Get user profile by permanent numerical ID
	 * 
	 * @param id User's permanent numerical ID
	 * @param token App or User auth token
	 * @param params `UserParams` object
	 * @returns Fetch Promise
	 */
	getProfileById: (id: string, token: string, params?: UserParams) => { return callApi(`/2/users/${id}`, token, toQueryString(params)); },

	/**
	 * Get user profile by their \@handle
	 * 
	 * @param handle User's \@handle
	 * @param token App or User auth token
	 * @param params `UserParams` object
	 * @returns Fetch Promise
	 */
	getProfileByHandle: (handle: string, token: string, params?: UserParams) => { return callApi(`/2/users/by/username/${handle}`, token, toQueryString(params)); },

	/**
	 * Get logged in user's timeline/home feed
	 * 
	 * @param userId Logged in user's permanent numerical ID
	 * @param token App or User auth token
	 * @param params `TimelineParams` object
	 * @returns Fetch Promise
	 */
	getMyFeed: (userId: string, token: string, params?: TimelineParams) => { return callApi(`/2/users/${userId}/timelines/reverse_chronological`, token, toQueryString(params)); },

	/**
	 * Get a user's Tweets
	 * 
	 * @param userId User's permanent numerical ID
	 * @param token App or User auth token
	 * @param params `TimelineParams` object
	 * @returns Fetch Promise
	 */
	getUsersTweets: (userId: string, token: string, params?: TimelineParams) => { return callApi(`/2/users/${userId}/tweets`, token, toQueryString(params)); },

	/**
	 * Get search results from a query
	 * 
	 * @param token App or User auth token
	 * @param params `SearchParams` object
	 * @returns Fetch Promise
	 */
	getSearchResults: (token: string, params: SearchParams) => { return callApi('/2/tweets/search/recent', token, toQueryString(params)); },
}

/**
 * Get the profile of a Twitter user by their username (\@handle)
 * 
 * @param handle User's \@handle
 * @returns Promise of user's profile
 */
export async function getProfile(handle: string): Promise<Profile> {
	//check for required environment variables
	if (!process.env.TWITTER_API_TOKEN) return { error: { title: 'Server Error', details: 'missing environment variables' } };

	//twitter api request
	let response;
	const params: UserParams = {
		'user.fields': ['protected', 'verified', 'description', 'profile_image_url', 'entities', 'public_metrics']
	};

	if (!isValidHandle(handle)) response = await TwitterEndpoints.getProfileById(handle, process.env.TWITTER_API_TOKEN, params);
	else response = await TwitterEndpoints.getProfileByHandle(handle.replaceAll('@', ''), process.env.TWITTER_API_TOKEN, params);

	//request failed
	if (response.status != 200) return { error: { title: 'Server Error', details: `failed with status code ${response.status} - ${response.statusText}` } };

	//try parse user
	const user: UserProfileResponse = await response.json();

	//log errors, these may exist even if user.data is a valid object
	if (user.errors) user.errors.forEach(error => console.log(error));

	return new Profile(user);
}