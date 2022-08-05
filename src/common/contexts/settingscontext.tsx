import React from 'react';
import BlurProvider from './appsettings/blur';

//TODO: Settings becomes the main component which includes all the individual contexts for App
//	Things like NSFW blur should have access to the localstorage for it's type
//	Visuals are per-device, so they can be unified between mobile/pc, such as always show overlay etc. or top&bottom vs. bottom display
//  Possibly worth putting a theme context, even though it's handled internally by tailwind
//	Filters will most likely have to be fetch only, so force a page refresh

//Probably move these into another file, but these should be saved/loaded to localstorage
export class ResultFilters {
	showReplies = true;
	showRetweets = true;
	showFlagged = true; //should we have this, just outright hide nsfw items so they don't appear on your feed?
	blacklistKeywords = ''; //hide tweets with these keywords?
}

export class TileSettings {
	inline = false;
	showMetrics = true;
	showMetricNumbers = true;
	showAuthors = true;
	showAuthorOnProfile = false; //hide author if it's their profile and it's their post
}

export class ModalSettings {
	showTweetText = true;
	showMetrics = true;
	showAuthors = true;
	showShareButton = true; //mobile only share button for system sharing
}

//General image settings
//TODO: consider if we need to use this, it's mainly as a thing for mobile
//		and slower connections to insure that their experience is faster
//		since this will be served and processed by Next/Image on the server
export class ImageSettings {
	optimizeThumbnails: number | undefined = 0;
	optimizeProfileImage: number | undefined = 0;
	optimizeImages: number | undefined = 0;
}

export default function SettingsProvider({ children }: any) {
	return (
		<BlurProvider children={children} />
	)
}