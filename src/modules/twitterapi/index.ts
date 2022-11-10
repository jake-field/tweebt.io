import { isValidHandle } from "../../common/utils/regextests";
import Profile from "../profile/types/profile";
import toQueryString, { SearchParams, TimelineParams, UserParams } from "./types/params";
import UserProfileResponse from "./types/user";

const baseUrl = 'https://api.twitter.com';

async function callApi(url: string, token: string, params?: string) {
	const header: RequestInit = {
		headers: {
			Authorization: `Bearer ${token}`, //applies to both App token and User token for Twitter
			'Content-Type': 'application/json',
		},
		method: 'GET',
	};

	const target = `${baseUrl}${url}` + (params && `?${params}`);
	return fetch(target, header);
}

export const TwitterEndpoints = {
	getProfileById: (id: string, token: string, params?: UserParams) => { return callApi(`/2/users/${id}`, token, toQueryString(params)); },
	getProfileByHandle: (handle: string, token: string, params?: UserParams) => { return callApi(`/2/users/by/username/${handle}`, token, toQueryString(params)); },
	getMyFeed: (userId: string, token: string, params?: TimelineParams) => { return callApi(`/2/users/${userId}/timelines/reverse_chronological`, token, toQueryString(params)); },
	getUsersTweets: (profileId: string, token: string, params?: TimelineParams) => { return callApi(`/2/users/${profileId}/tweets`, token, toQueryString(params)); },
	getSearchResults: (token: string, params: SearchParams) => { return callApi('/2/tweets/search/recent', token, toQueryString(params)); },
}

//Function to get the profile of a twitter user by their username (@handle)
export async function getProfile(handle: string): Promise<Profile> {
	//check for required environment variables
	if (!process.env.TWITTER_API_TOKEN) return { error: { title: 'Server Error', details: 'missing environment variables' } };

	//twitter api request
	let response;
	const params: UserParams = {
		"user.fields": ["protected", "verified", "description", "profile_image_url", "entities", "public_metrics"]
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