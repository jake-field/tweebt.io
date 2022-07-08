import Media from "./media";
import Pagination from "./pagination";
import Profile from "./profile";

export default interface ApiResponse {
	profileResult?: Profile;
	galleryResult?: {
		media: Media[];
		pagination: Pagination;
	};
	error?: any;
}