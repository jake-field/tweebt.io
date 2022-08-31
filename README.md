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
- iOS oauth issue: https://twittercommunity.com/t/cannot-have-ios-devices-authenticate-with-oauth2-0-in-a-web-application/173772
- `offline.access` scope issues: https://twittercommunity.com/t/refresh-token-expiring-with-offline-access-scope/168899/14
	- Unsure if this is on my end but for the most part this seems like an issue on their end