import Profile from "../../common/types/profile";
import { Response } from "../../common/types/response";
import { validateHandle } from "../../common/utils/validation";
import { Gallery } from "../gallery/types/gallery";
import { Timeline } from "./types/timeline";
import { User } from "./types/user";

//API bearer token header
const authHeader: RequestInit = {
	headers: {
		authorization: `Bearer ${process.env.TWITTER_API_TOKEN}`
	}
};

//Function to get the profile of a twitter user by their username (@handle)
//TODO: more error checking and edge cases, and consider performance impact of bio parsing
export async function getProfile(handle: string): Promise<Response> {
	//check for required environment variables
	if (!process.env.TWITTER_API_TOKEN || !process.env.TWITTER_API) return { error: 'missing environment variables' };

	//check for valid handle
	if (!validateHandle(handle)) return { error: 'handle validation failed' };

	//pre-strip @ as twitter only accepts usernames (handle without @)
	handle = handle.replaceAll('@', '');

	//twitter api request
	const apiEndpoint = `${process.env.TWITTER_API}/2/users/by/username/${handle}`;
	const query = '?user.fields=protected,verified,description,profile_image_url,entities,public_metrics';
	const response = await fetch(apiEndpoint + query, authHeader);

	//request failed
	if (response.status != 200) return { error: `failed with status code ${response.status} - ${response.statusText}` };

	//try parse user
	const user: User = await response.json();

	//log errors, these may exist even if user.data is a valid object
	if (user.errors) {
		user.errors.forEach(error => console.log(error));
	}

	if (user.data) {
		//create profile and set the minimum required for the client
		let profile: Profile = {
			id: user.data.id,
			handle: user.data.username,
			name: user.data.name,
			image: user.data.profile_image_url.replace(/normal/gi, "400x400"), //enforce large profile image
		}

		//optional flags/info
		if (user.data.protected) profile.protected = true;
		if (user.data.verified) profile.verified = true;
		if (user.data.entities?.url) profile.url = user.data.entities?.url?.urls[0].display_url;
		if (user.data.public_metrics) {
			const metrics = user.data.public_metrics;
			profile.follower_count = metrics.followers_count;
			profile.following_count = metrics.following_count;
			profile.tweet_count = metrics.tweet_count;
		}

		//check if user has a bio
		if (user.data.description) {
			const entities = user.data.entities?.description;

			//strip stacked newline characters, only support single newlines for styling purposes
			let bio = user.data.description.replace(/\n{2,}/g, '\n');

			//does bio contain entities? (url/@/#) TODO:support cashtags?
			if (entities) {
				let pattern: string = '';

				//precondition urls, replacing t.co with the normal urls
				entities?.urls?.forEach((value) => bio = bio.replace(value.url, value.display_url));

				//build pattern for split and push info to bio_data
				entities?.urls?.forEach(url => pattern += `(${url.display_url})|`);
				entities?.mentions?.forEach(mention => pattern += `(@${mention.username})|`);
				entities?.hashtags?.forEach(hashtag => pattern += `(#${hashtag.tag})|`);

				//error checking
				if (pattern === '') {
					console.log('missing pattern, something went wrong here, returning plain bio');
					profile.bio = bio;
					return { profile: profile };
				}

				//remove extra |
				pattern = pattern.substring(0, pattern.length - 1);

				//split
				const splitRegex = new RegExp(pattern, 'g');
				const split = bio?.split(splitRegex);
				let bioArray: { text?: string, link?: string }[] = [];

				//determine link from text
				split.forEach(value => {
					if (value) bioArray.push(splitRegex.test(value) ? { link: value } : { text: value });
				});

				profile.bio = bioArray;
			} else {
				//no entities, just pass down bio as is
				profile.bio = bio;
			}
		}

		//return profile
		return { profile: profile };
	}

	//return errors
	return { error: user.errors![0].detail };
}

export async function getTimeline(userid: string | undefined, next?: string) {
	if (userid) {
		let query = '?expansions=attachments.media_keys,author_id&tweet.fields=possibly_sensitive&user.fields=username&media.fields=media_key,preview_image_url,type,url,width,height&exclude=replies,retweets&max_results=50';

		if (next) query += `&pagination_token=${next}`;

		console.log(query);

		const res = await fetch(`${process.env.TWITTER_API}/2/users/${userid}/tweets` + query, authHeader);

		if (res.status != 200) {
			//error check
			console.log(`getTimeline failed with status ${res.status}; "${res.statusText}"`);
			return null;
		}

		const timeline: Timeline = await res.json();
		return new Gallery(timeline);

	} else if (userid) {
		console.log('user lookup error');
		return null;
	}

	console.log('user not found');
	return null;
}