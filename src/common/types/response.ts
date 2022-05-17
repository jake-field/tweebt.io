import Profile, { ProfileMedia } from "./profile";

export interface Response {
	profile?: Profile;
	media?: ProfileMedia;
	error?: string;
}