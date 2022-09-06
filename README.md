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
- Fix auth issues (mainly iOS), also error page on failed auth.

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
- iOS oauth issue: https://twittercommunity.com/t/cannot-have-ios-devices-authenticate-with-oauth2-0-in-a-web-application/173772
- `offline.access` scope issues: https://twittercommunity.com/t/refresh-token-expiring-with-offline-access-scope/168899/14
	- Unsure if this is on my end but for the most part this seems like an issue on their end
