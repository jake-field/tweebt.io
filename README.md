# NextJS + React Tweet Gallery (tweebt)

This project is a complete redesign of the Angular/.NET version I made in January.
It serves as a project to learn React + NextJS (With tailwindCSS) to produce a useable website.

Again much like the previous version, Twitter still refuses to implement resolving video urls from media tweets on the V2 api

This readme will be replaced at some point with more information.
Below are some issues I'm running into currently which hopefully be fixed soon enough.

# NextAuth Issues:
- No support for manually updating object data or forcing a token refresh. Twitter invalidates a token if you log in on another device, requiring a refresh, which NextAuth doesn't support
	- Manually coded automatic refresh token rotation supported, but only on age expiry: https://next-auth.js.org/tutorials/refresh-token-rotation
	- Potential workaround making another signIn provider: https://github.com/nextauthjs/next-auth/discussions/4229
	- Open Issue on NextAuth repo: https://github.com/nextauthjs/next-auth/issues/4902

# Twitter Issues:
- Quote tweets will only return a media object for the quoter. The quotee, if media, will only include the media_key which needs to be resolved
	- Quoter media will be displayed by my app instead of the quotee media as it's not a retweet
	- Quotee media_key is located in `includes.tweets[n].attachments.media_keys[...]` but no linked media object is located in `includes.media` and requires a seperate api call
	- This requires a separate search through `includes.tweets` to find media keys to resolve that aren't already available in `includes.media`
		- Most likely do this first then append resolved media objects to `includes.media`
- iOS oauth issue: https://twittercommunity.com/t/cannot-have-ios-devices-authenticate-with-oauth2-0-in-a-web-application/173772
- Twitter/v2/ does not support video/gif urls yet (acknowledged in 2020 by twitter staff): https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/media
	- Recently v2 users got granted access to the v1.1 media endpoint, but that's for uploads only, not fetching. A weird "workaround" 2 years later...
	- https://twittercommunity.com/t/v1-1-media-endpoints-available-for-essential-access-in-the-twitter-api-v2/171664