import Profile from '../profile/types/profile';
import { validateHandle } from '../profile/utils/validation';
import { TwitterEndpoints } from './endpoints';
import User from './types/user';

//Function to get the profile of a twitter user by their username (@handle)
//TODO: more error checking and edge cases, and consider performance impact of bio parsing
export async function getProfile(handle: string): Promise<Profile> {
	//check for required environment variables
	if (!process.env.TWITTER_API_TOKEN) return { error: { title: 'Server Error', details: 'missing environment variables' } };

	//twitter api request
	let response;
	const query = 'user.fields=protected,verified,description,profile_image_url,entities,public_metrics';

	//TODO: replace token with usertoken if possible for protected accounts
	if (!validateHandle(handle)) response = await TwitterEndpoints.getProfileById(handle, process.env.TWITTER_API_TOKEN, query);
	else response = await TwitterEndpoints.getProfileByHandle(handle.replaceAll('@', ''), process.env.TWITTER_API_TOKEN, query);

	//request failed
	if (response.status != 200) return { error: { title: 'Server Error', details: `failed with status code ${response.status} - ${response.statusText}` } };

	//try parse user
	const user: User = await response.json();

	//log errors, these may exist even if user.data is a valid object
	if (user.errors) {
		user.errors.forEach(error => console.log(error));
	}

	return new Profile(user);
}