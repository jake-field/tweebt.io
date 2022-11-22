# [tweebt.io](https://tweebt.io)

A React website to view Twitter indirectly as a rolling mosaic gallery of media rather than tweets.
Designed to avoid the noise and drama one can be exposed to there, but provide a fast and easy way to navigate your feed, artists, content creators and general media from searching hashtags, topics or keywords.

This project is a complete redesign of the Angular/.NET version I made in January.
It serves as a project to learn React, NextJS and TailwindCSS to produce a usable, enjoyable website.

This readme will be replaced at some point with more information.
Below are some issues I'm running into currently which hopefully be fixed soon enough.

## General Tasks:
- Consider adjusting mosacic to pulled time differences (More than 2 hours ago, 1 day ago, 2 days ago, 1 year ago)
- Address metadata bug introduced by Next13, remove title fixes once done. Right now metadata isn't updated but only shows on share sheets.

## Twitter Issues:
- Accounts that were public, now protected, will contain media that fails to resolve. If a protected account unlocks, media can still fail to resolve (404)
	- general media urls can fail to resolve as the last few letters of the file are scrambled
	- videos go from /pu/ to /pr/, some /pr/ videos may resolve.
	- I attempted to try load the media via a fetch with the bearer token attached to the header, returns 403 api access level
	- This appears to be linked to retweet content only.
	- https://twittercommunity.com/t/media-resource-image-404/133136/5
- iOS oauth issue: https://twittercommunity.com/t/cannot-have-ios-devices-authenticate-with-oauth2-0-in-a-web-application/173772
	- logging in on iOS devices with the twitter app installed will open the twitter app's in-app browser which breaks auth/sessions.
	- temp fix is to "open in safari" when the auth page is FULLY loaded
	- issue seems to lie with https://twitter.com/.well-known/apple-app-site-association not excluding the oauth2.0 path