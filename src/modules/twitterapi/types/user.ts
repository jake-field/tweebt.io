import { ResourceError } from './errors';
import { PublicUserMetrics } from './metrics';
import { User } from './timeline';

interface Entities {
	url?: {
		urls: {
			start: number;
			end: number;
			url: string;
			expanded_url: string;
			display_url: string;
		}[];
	};

	description?: {
		mentions?: {
			start: number;
			end: number;
			username: string;
		}[];
		urls?: {
			start: number;
			end: number;
			url: string;
			expanded_url: string;
			display_url: string;
		}[];
		hashtags?: {
			start: number;
			end: number;
			tag: string;
		}[];
	};
}

export interface UserProfile extends User {
	description?: string;
	protected?: boolean;
	verified?: boolean;
	public_metrics?: PublicUserMetrics;
	entities?: Entities;
}

export default interface UserProfileResponse {
	data?: UserProfile;
	errors?: ResourceError[];
}