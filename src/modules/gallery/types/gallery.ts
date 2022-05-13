import Timeline, { Meta } from "../../twitter/types/timeline";

export interface GalleryItem {
	media_key: string;
	srcimg: string;
	previmg: string;
	tweetid: string;
	author: string;
	type: string;
	width: number;
	height: number;
	possibly_sensitive?: boolean;
}

export interface Gallery {
	tweetMedia: GalleryItem[];
	pagination?: Meta;
	error?: string;
}

export class Gallery implements Gallery {
	constructor({ includes, data, meta, errors }: Timeline) {
		this.tweetMedia = [];
		this.pagination = meta;
		if (includes && data) {
			includes.media?.map(mediaItem => {
				const tweet = data.find(t => t.attachments?.media_keys?.find(key => key === mediaItem.media_key));
				const tweetId = tweet?.id || 'cannot resolve tweet id';
				const authorUsername = includes.users?.find(u => u.id === data.find(t => t.id === tweetId)?.author_id)?.username || 'cannot resolve author username';
				const possiblySensitive = tweet?.possibly_sensitive;
				this.tweetMedia.push({
					media_key: mediaItem.media_key,
					srcimg: mediaItem.url || mediaItem.preview_image_url || 'error',
					previmg: mediaItem.preview_image_url || mediaItem.url && (mediaItem.url + '?name=thumb') || 'no preview url',
					type: mediaItem.type,
					width: mediaItem.width,
					height: mediaItem.height,
					possibly_sensitive: possiblySensitive ? true : undefined,
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