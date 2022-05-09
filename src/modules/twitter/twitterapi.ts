import { Gallery } from "../gallery/types/gallery";
import { Timeline } from "./types/timeline";
import { User } from "./types/user";

const authHeader: RequestInit = { headers: { authorization: `Bearer ${process.env.TWITTER_API_TOKEN}` } };

export async function getUserByUsername(username: string) {
	username = username.replaceAll("@", "");
	console.log(username);
	const res = await fetch(`${process.env.TWITTER_API}/users/by/username/${username}?user.fields=url,protected,description,profile_image_url`, authHeader);

	if (res.status != 200) {
		//error check
		console.log(`getUserByUsername failed with status ${res.status}; "${res.statusText}"`);
		return null;
	}

	const user: User = await res.json();

	//profile image upsize
	if(user && user.data) {
		user.data.profile_image_url = user.data.profile_image_url.replace(/normal/gi, "400x400");
		console.log(user.data.profile_image_url);
	}

	return user;
}

export async function getTimelineByUsername(username: string) {
	const user = await getUserByUsername(username);
	return getTimeline(user?.data?.id);
}

export async function getTimeline(userid: string | undefined) {
	if (userid) {
		const query = '?expansions=attachments.media_keys,author_id&tweet.fields=possibly_sensitive&user.fields=username&media.fields=media_key,preview_image_url,type,url,width,height&exclude=replies,retweets&max_results=100';
		const res = await fetch(`${process.env.TWITTER_API}/users/${userid}/tweets` + query, authHeader);

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