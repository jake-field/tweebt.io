import { Gallery } from "../gallery/types/gallery";
import { Timeline } from "./types/timeline";
import { User } from "./types/user";

const authHeader: RequestInit = { headers: { authorization: `Bearer ${process.env.TWITTER_API_TOKEN}` } };

async function getUserByUsername(username: string) {
	const res = await fetch(`${process.env.TWITTER_API}/users/by/username/${username}`, authHeader);

	if (res.status != 200) {
		//error check
		console.log(`getUserByUsername failed with status ${res.status}; "${res.statusText}"`);
		return null;
	}

	const user: User = await res.json();
	return user;
}

export async function getTimeline(username: string) {
	const user = await getUserByUsername(username);
	console.log(user);

	if (user && user.data) {
		const query = '?expansions=attachments.media_keys,author_id&tweet.fields=possibly_sensitive&user.fields=username&media.fields=media_key,preview_image_url,type,url,width,height&exclude=replies,retweets&max_results=100';
		const res = await fetch(`${process.env.TWITTER_API}/users/${user.data.id}/tweets` + query, authHeader);

		if (res.status != 200) {
			//error check
			console.log(`getTimeline failed with status ${res.status}; "${res.statusText}"`);
			return null;
		}

		const timeline: Timeline = await res.json();
		return new Gallery(timeline);

	} else if (user) {
		console.log('user lookup error');
		return null;
	}

	console.log('user not found');
	return null;
}