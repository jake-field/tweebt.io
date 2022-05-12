import Profile from "./profile";

export interface Response {
	profile?: Profile;
	error?: string;
}