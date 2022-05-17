import Profile, { ProfileMedia, ProfileMediaItem, ProfileMediaPagination } from "../../common/types/profile";
import { Response } from "../../common/types/response";
import { validateHandle } from "../../common/utils/validation";
import Timeline from "./types/timeline";
import User from "./types/user";

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
		if (user.data.entities?.url) profile.url = user.data.entities?.url?.urls[0].expanded_url.replace(/^(https?:\/\/)?(www.)?/, '');
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

export async function getProfileMedia(profile_id: string, params?: ProfileMediaPagination, max_results: number = 100): Promise<Response> {
	//check for required environment variables
	if (!process.env.TWITTER_API_TOKEN || !process.env.TWITTER_API) return { error: 'missing environment variables' };

	//twitter api request
	const apiEndpoint = `${process.env.TWITTER_API}/2/users/${profile_id}/tweets`;

	//selected query params
	const query =
		'?expansions=attachments.media_keys,author_id' +
		'&user.fields=username' +
		'&tweet.fields=possibly_sensitive,public_metrics' +
		'&media.fields=media_key,preview_image_url,url,width,height' + //media_key required for tweet matching
		'&exclude=replies,retweets' +
		`&max_results=${max_results}` +
		(params?.token ? `&pagination_token=${params?.token}` : '') +
		(params?.newest_id ? `&since_id=${params?.newest_id}` : '') +
		(params?.oldest_id ? `&until_id=${params?.oldest_id}` : '');

	const response = await fetch(apiEndpoint + query, authHeader);

	//request failed
	if (response.status != 200) return { error: `failed with status code ${response.status} - ${response.statusText}` };

	//try parse timeline
	const timeline: Timeline = await response.json();

	//log errors, these may exist even if timeline.data is a valid object
	if (timeline.errors) {
		timeline.errors.forEach(error => console.log(error));
	}

	if (timeline.data) {
		if (timeline.includes?.media) {
			let profileMedia: ProfileMedia = { items: [] };

			//pagination info, done this way due to SSR serialization not liking undefined params here
			if (timeline.meta) {
				profileMedia.pagination = {}; //empty object
				if (timeline.meta.newest_id) profileMedia.pagination.newest_id = timeline.meta.newest_id;
				if (timeline.meta.oldest_id) profileMedia.pagination.oldest_id = timeline.meta.oldest_id;
				if (timeline.meta.next_token) profileMedia.pagination.token = timeline.meta.next_token;
			}

			//pull information from the timeline and add each media item to profileMedia
			timeline.includes.media.forEach(mediaItem => {
				const tweet = timeline.data!.find(t => t.attachments?.media_keys?.find(key => key === mediaItem.media_key));
				const tweetAuthor = timeline.includes!.users?.find(u => u.id === timeline.data!.find(t => t.id === tweet!.id)?.author_id)?.username;

				let newItem: ProfileMediaItem = {
					image: mediaItem.url || mediaItem.preview_image_url || 'error',
					width: mediaItem.width,
					height: mediaItem.height,
					tweetid: tweet?.id || 'unknown tweet id',
					author: tweetAuthor || 'unknown tweet author'
				};

				const metrics = tweet?.public_metrics;
				if (metrics) {
					newItem.replies = metrics.reply_count;
					newItem.retweets = (metrics.retweet_count || 0) + (metrics.quote_count || 0);
					newItem.likes = metrics.like_count;
				}

				if (tweet?.possibly_sensitive) newItem.flagged = true;
				profileMedia.items.push(newItem);
			});

			return { media: profileMedia };
		}
		else {
			return { error: 'user has no media' };
		}
	}

	return { error: timeline.errors && timeline.errors[0].detail || 'user has no media' };
}