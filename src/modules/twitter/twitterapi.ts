import { Gallery } from "../gallery/types/gallery";
import { Timeline } from "./types/timeline";
import { User } from "./types/user";

const authHeader: RequestInit = { headers: { authorization: `Bearer ${process.env.TWITTER_API_TOKEN}` } };

export async function getUserByUsername(username: string) {
	username = username.replaceAll(/@/g, "");
	console.log(username);
	const res = await fetch(`${process.env.TWITTER_API}/users/by/username/${username}?user.fields=protected,verified,description,profile_image_url,entities`, authHeader);

	if (res.status != 200) {
		//error check
		console.log(`getUserByUsername failed with status ${res.status}; "${res.statusText}"`);
		return null;
	}

	const user: User = await res.json();

	//adjust the user data that we recieve
	if (user && user.data) {
		//profile image upsize
		user.data.profile_image_url = user.data.profile_image_url.replace(/normal/gi, "400x400");

		//attempt to convert links in bio
		if (user.data.description) {
			let bio: string = user.data.description;
			const urls = user.data.entities?.description?.urls;
			//const mentions = user.data.entities?.description?.mentions;
			//const hashtags = user.data.entities?.description?.hashtags;

			if (urls) {
				for (let i = 0; i < urls.length; i++) {
					bio = bio.replace(urls[i].url, urls[i].display_url);
				}
			}

			//These have been replaced by regex on the clientside for JSX & router.push functionality
			// if(mentions) {
			// 	for (let i = 0; i < mentions.length; i++) {
			// 		//bio = bio.replace(`@${mentions[i].username}`, `<a href='/${mentions[i].username}'>$&</a>`);
			// 		//bio = bio.replace(`@${mentions[i].username}`, `<a target='_blank' href='https://twitter.com/${mentions[i].username}'>$&</a>`);
			// 	}
			// }

			// if(hashtags) {
			// 	for (let i = 0; i < hashtags.length; i++) {
			// 		bio = bio.replace(`#${hashtags[i].tag}`, `<a target='_blank' href='https://twitter.com/search?q=%23${hashtags[i].tag}'>$&</a>`);
			// 	}
			// }

			user.data.description = bio;
		}
	}

	return user;
}

export async function getTimeline(userid: string | undefined, next?:string) {
	if (userid) {
		let query = '?expansions=attachments.media_keys,author_id&tweet.fields=possibly_sensitive&user.fields=username&media.fields=media_key,preview_image_url,type,url,width,height&exclude=replies,retweets&max_results=50';
		
		if(next) query += `&pagination_token=${next}`;

		console.log(query);
		
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