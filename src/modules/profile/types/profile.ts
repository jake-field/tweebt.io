import ProxyUrl from "../../../common/utils/proxyurl";
import User from "../../twitterapi/types/user";

export interface ProfileData {
	id: string;
	handle: string;
	name: string;
	image: string; //no banner support yet, only profile image
	url?: string;

	//bio array, may be just a single block of text or a split for link replacement, or no bio
	bio?: string | { text?: string, link?: string }[];

	//metrics
	follower_count?: number;
	following_count?: number;
	tweet_count?: number;

	//flags
	protected?: boolean;
	verified?: boolean;
}

export default class Profile {
	data?: ProfileData;
	error?: { title: string, details: string };

	constructor(user?: User) {
		//error on invalid user
		if (!user || !user.data) {
			this.error = {
				title: user?.errors && user.errors[0].title || 'Error',
				details: user?.errors && user.errors[0].detail || 'An error has occured fetching the profile',
			};

			return;
		}

		this.data = {
			id: user.data.id,
			handle: user.data.username,
			name: user.data.name,

			//route through proxy and use full 400x400 image here
			image: ProxyUrl(user.data.profile_image_url)!.replace(/normal/gi, '400x400'), //enforce large profile image
		}

		//optional flags/info
		if (user.data.protected) this.data.protected = true;
		if (user.data.verified) this.data.verified = true;
		if (user.data.entities?.url) this.data.url = user.data.entities?.url?.urls[0].expanded_url.replace(/^(https?:\/\/)?(www.)?/, '');
		if (user.data.public_metrics) {
			const metrics = user.data.public_metrics;
			this.data.follower_count = metrics.followers_count;
			this.data.following_count = metrics.following_count;
			this.data.tweet_count = metrics.tweet_count;
		}

		//check if user has a bio
		if (user.data.description) {
			const entities = user.data.entities?.description;

			//strip stacked newline characters, only support single newlines for styling purposes
			let bio = user.data.description.replace(/\n{2,}/g, '\n');

			//does bio contain entities? (url/@/#)
			//TODO: support cashtags?
			if (entities) {
				let pattern: string = '';

				//precondition urls, replacing t.co with the normal urls
				entities?.urls?.forEach((value) => bio = bio.replace(value.url, value.expanded_url));

				//build pattern for split and push info to bio_data
				entities?.urls?.forEach(url => pattern += `(${url.expanded_url})|`);
				entities?.mentions?.forEach(mention => pattern += `(@${mention.username})|`);
				entities?.hashtags?.forEach(hashtag => pattern += `(#${hashtag.tag})|`);

				//error checking
				if (pattern === '') {
					console.log('missing pattern, something went wrong here, returning plain bio');
					this.data.bio = bio;
					return; //exit early
				}

				//remove extra |
				pattern = pattern.substring(0, pattern.length - 1);

				//split
				const splitRegex = new RegExp(pattern, 'g');
				const split = bio?.split(splitRegex);
				let bioArray: { text?: string, link?: string }[] = [];

				//determine link from text
				split.forEach(value => {
					if (value) bioArray.push(splitRegex.test(value) ? { link: value.replace(/^https?:\/\//, '') } : { text: value });
				});

				this.data.bio = bioArray;
			} else {
				//no entities, just pass down bio as is
				this.data.bio = bio;
			}
		}
	}
}