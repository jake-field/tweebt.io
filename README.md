# [tweebt.io](https://tweebt.io)

A React website to view Twitter indirectly as a rolling mosaic gallery of media rather than tweets.
Designed to avoid the noise and drama one can be exposed to there, but provide a fast and easy way to navigate your feed, artists, content creators and general media from searching hashtags, topics or keywords.

This project is a complete redesign of the Angular/.NET version I made in January.
It serves as a project to learn React, NextJS and TailwindCSS to produce a usable, enjoyable website.

This readme will be replaced at some point with more information.
Below are some issues I'm running into currently which hopefully be fixed soon enough.

## TODO:
- Consider making my own mosaic grid code (probably ditch Next/Image as well since Twitter already compresses)
	- Keep an eye on MDN's CSS Mosaic grid update
- Reduce DOM size by replacing offscreen items with placeholders or fixed height spacers, replacing videos with their preview images
- Adjust gallery objects to have a stored source (handle, search term, feed) so that back/forward retains state without having to reload
- Make fancy landing page
- Implement options panel fully
- Offload inline CSS into component.css files to reduce html size etc.

## Mosaic Issues:
- Probably my fault but columns can get unbalanced fairly quickly
	- Most likely caused by no fixed height of elements in CSS
	- Can be 'hidden' by increasing infinite-scroll's update point

## NextAuth Issues:
- No support for manually updating object data or forcing a token refresh. Twitter invalidates a token if you log in on another device, requiring a refresh, which NextAuth doesn't support
	- Manually coded automatic refresh token rotation supported, but only on age expiry: https://next-auth.js.org/tutorials/refresh-token-rotation
	- Potential workaround making another signIn provider: https://github.com/nextauthjs/next-auth/discussions/4229
	- Open Issue on NextAuth repo: https://github.com/nextauthjs/next-auth/issues/4902

## Twitter Issues:
- Accounts that were public, now protected, will contain media that fails to resolve. If a protected account unlocks, media can still fail to resolve (404)
	- general media urls can fail to resolve as the last few letters of the file are scrambled
	- videos go from /pu/ to /pr/, some /pr/ videos may resolve.
	- I attempted to try load the media via a fetch with the bearer token attached to the header, however, got an access level error (essentials)???
	- https://twittercommunity.com/t/media-resource-image-404/133136/5
- iOS oauth issue: https://twittercommunity.com/t/cannot-have-ios-devices-authenticate-with-oauth2-0-in-a-web-application/173772
	- logging in on iOS devices with the twitter app installed will open the twitter app's in-app browser which breaks auth.
	- temp fix is to "open in safari" when the auth page is FULLY loaded
- `offline.access` scope issues: https://twittercommunity.com/t/refresh-token-expiring-with-offline-access-scope/168899/14
	- This scope issue prevents accounts from being logged in on multiple devices, invalidating other devices when logging in
