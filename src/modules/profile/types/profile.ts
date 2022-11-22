import proxyMediaURL from 'common/utils/proxymediaurl';
import UserProfileResponse from 'modules/twitterapi/types/user';

export interface ProfileData {
	id: string;
	handle: string;
	name: string;
	image: string; //no banner support yet, only profile image
	url?: string;
	bio?: string;

	//metrics
	follower_count: number;
	following_count: number;
	tweet_count: number;

	//flags
	protected?: boolean;
	verified?: boolean;
}

export default class Profile {
	data?: ProfileData;
	error?: { title: string, details: string };

	constructor(user?: UserProfileResponse) {
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

			//some users have an empty character as a name, replace this character with their handle (UX choice)
			name: encodeURI(user.data.name) === '%EF%B8%8F' ? user.data.username : user.data.name,

			//route image through proxy and use full 400x400 image here
			image: proxyMediaURL(user.data.profile_image_url || '/media/user_normal.png')!.replace(/normal/gi, '400x400'), //enforce large profile image

			//metrics
			follower_count: user.data.public_metrics?.followers_count || 0,
			following_count: user.data.public_metrics?.following_count || 0,
			tweet_count: user.data.public_metrics?.tweet_count || 0,

		};

		//optional stuff (only set them if true, to reduce json)
		if (user.data.protected) this.data.protected = true;
		if (user.data.verified) this.data.verified = true;

		//use unshortened (t.co) url if there is one and strip `http(s)://www.`
		let url = user.data.entities?.url?.urls.at(0);
		if (url) this.data.url = url.expanded_url.replace(/^(https?:\/\/)?(www\.)?/, '');

		//check if user has a bio
		if (user.data.description) {
			//for visual purposes, we don't need more then one newline if the user has formatted their bio that way
			this.data.bio = user.data.description?.replace(/\n{2,}/gi, '\n');

			//replace t.co with the normal urls
			user.data.entities?.description?.urls?.forEach(e => this.data!.bio = this.data!.bio!.replace(e.url, e.expanded_url));
		}
	}
}