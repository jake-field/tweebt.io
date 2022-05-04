export interface Tweet {
	id: string;
	text: string;
	author_id:string;
	possibly_sensitive?: boolean;

	attachments?: {
		media_keys?: string[];
	};
}