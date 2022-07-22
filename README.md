# NextJS + React Tweet Gallery

This project is a complete redesign of the Angular/.NET version I made in January.
It serves as a project to learn React + NextJS (With tailwindCSS) to produce a usable website.

Again much like the previous version, Twitter still refuses to implement core features to the V2 api such as fetching homepage timelines (where you see tweets from people you follow) and resolving video urls from media tweets.

This readme will be replaced at some point with more information


# External Issues:
- iOS oauth issue: https://twittercommunity.com/t/cannot-have-ios-devices-authenticate-with-oauth2-0-in-a-web-application/173772
- Twitter/v2/ does not support video/gif urls yet (acknowledged in 2020 by twitter staff): https://developer.twitter.com/en/docs/twitter-api/data-dictionary/object-model/media
	- Recently v2 users got granted access to the v1.1 media endpoint, but that's for uploads only, not fetching. A weird "workaround" 2 years later...
	- https://twittercommunity.com/t/v1-1-media-endpoints-available-for-essential-access-in-the-twitter-api-v2/171664