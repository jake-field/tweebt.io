import { signOut } from "next-auth/react";
import toQueryString from "../twitterapi/types/params";
import Gallery from "./types/gallery";

export type GalleryParams = {
	q?: string;
	exclude?: ('retweets' | 'replies')[];
	max_results?: number;
	next?: string;
};

export interface GalleryResponse {
	status: number;
	status_text?: string;
	gallery?: Gallery;
};

export default async function getGallery(endpoint: string, params: GalleryParams, setGallery: (g: Gallery) => void, gallery?: Gallery): Promise<GalleryResponse> {
	const res = await fetch(endpoint + (params && `?${toQueryString(params)}`));

	if (res.status === 401) {
		signOut();
		//signIn('twitter');
		throw 'Lost session, forcing logout;';
	}

	const data: Gallery = await res.json() as Gallery;
	if ((data.items && data.items.length > 0) || data.meta) {
		setGallery({
			items: gallery?.items ? [...gallery?.items, ...data.items] : [...data.items],
			error: data.error || gallery?.error, //use newest error?
			meta: {
				result_count: (gallery?.meta.result_count || 0) + data.meta.result_count,
				newest_id: gallery?.meta.newest_id || data.meta.newest_id, //take newest from original gallery first
				oldest_id: data.meta.oldest_id, //always take oldest from newest request
				next_token: data.meta.next_token, //only use current next token
				previous_token: gallery?.meta.previous_token || data.meta.previous_token, //should take oldest prev token
			}
		});
	}

	return {
		status: res.status,
		status_text: res.statusText,
		gallery: data
	};
}