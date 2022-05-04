import { Timeline } from "../../twitter/types/timeline";

export interface GalleryItem {
	media_key: string;
	srcimg: string;
	previmg: string;
	tweetid: string;
	author: string;
	type: string;
	width: number;
	height: number;
}

export interface Gallery {
	tweetMedia: GalleryItem[];
	error?: string;
}

export class Gallery implements Gallery {
	constructor({ includes, data }: Timeline) {
		this.tweetMedia = [];
		if (includes && data) {
			includes.media.map(mediaItem => {
				const tweetId = data.find(t => t.attachments?.media_keys?.find(key => key === mediaItem.media_key))?.id || 'cannot resolve tweet id';
				const authorUsername = includes.users?.find(u => u.id === data.find(t => t.id === tweetId)?.author_id)?.username || 'cannot resolve author username';
				this.tweetMedia.push({
					media_key: mediaItem.media_key,
					srcimg: mediaItem.url || 'no source url',
					previmg: mediaItem.preview_image_url || mediaItem.url && (mediaItem.url + '?name=thumb') || 'no preview url',
					type: mediaItem.type,
					width: mediaItem.width,
					height: mediaItem.height,
					tweetid: tweetId,
					author: authorUsername,
				});
			});
		}
		else {
			this.error = "no tweets found";
		}
	}
}