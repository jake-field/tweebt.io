import { PublicTweetMetrics } from './metrics';

export interface Tweet {
	id: string;
	text: string;
	author_id: string;
	possibly_sensitive?: boolean;
	public_metrics?: PublicTweetMetrics;
	created_at: string;

	attachments?: {
		media_keys?: string[];
	};

	referenced_tweets?: {
		type: 'retweeted' | 'replied_to' | 'quoted';
		id: string;
	}[]
}