/**
 * Tweet types to exclude from results.
 * 
 * @param retweets Exclude retweets from results (includes quote retweets)
 * @param replies Exclude replies from results (reduces maximum possible results to 800 Tweets)
 * 
 */
export type ExcludeFields = (
	//defaults

	//optional
	'retweets' |
	'replies'
)[];

/**
 * Optional Tweet sub-object expansions.
 * You must request the Tweet object expansions from TweetFields (`tweet.fields`) for these to exist.
 * 
 * @param attachments.poll_ids requires `TweetFields.attachments`
 * @param attachments.media_keys requires `TweetFields.attachments`
 * @param author_id requires `TweetFields.author_id`
 * @param geo.place_id requires `TweetFields.geo`
 * @param in_reply_to_user_id requires `TweetFields.in_reply_to_user_id`
 * @param entities.mentions.username requires `TweetFields.entities`
 * @param referenced_tweets.id requires `TweetFields.referenced_tweets`
 * @param referenced_tweets.id.author_id requires `TweetFields.referenced_tweets`
 * 
 */
export type ExpansionFields = (
	//defaults

	//optional
	'attachments.poll_ids' |
	'attachments.media_keys' |
	'author_id' |
	'geo.place_id' |
	'in_reply_to_user_id' |
	'referenced_tweets.id' |
	'entities.mentions.username' |
	'referenced_tweets.id.author_id'
)[];

/**
 * Optional User expansions, defaults are always returned even if not asked for.
 * 
 * @default id name username
 * 
 * @param id Permanent numerical ID for user
 * @param name Chosen name for user (any language, characters, emoji)
 * @param username Chosen \@handle for user `[a-zA-Z0-9_]{1,15}`
 * @param created_at Date of when account was created
 * @param description User's Bio section
 * @param entities Entity objects found in the description, such as URLs, \@Handles and Hash/Cashtags
 * @param location Geographical information of user (can be custom string)
 * @param pinned_tweet_id ID of the user's pinned tweet, should be used in conjunction with `expansions.pinned_tweet_id`
 * @param protected Returns true if user's account is protected/locked/private
 * @param public_metrics Object containing user metrics such as follower counts etc.
 * @param url User's displayed website url
 * @param verified Returns true if the user has been verified by Twitter
 * @param withheld Contains reason if the user is withheld in certain countries, resulting in an inaccessible profile
 * 
 */
export type UserFields = (
	//defaults
	'id' |
	'name' |
	'username' |

	//optional
	'created_at' |
	'description' |
	'entities' |
	'location' |
	'pinned_tweet_id' |
	'profile_image_url' |
	'protected' |
	'public_metrics' |
	'url' |
	'verified' |
	'withheld'
)[];

/**
 * Optional Tweet expansions, defaults are always returned even if not asked for.
 * 
 * @default id text
 * 
 * @param id Tweet ID
 * @param text Tweet text
 * @param attachments Object containing attachments such as media, files, urls
 * @param author_id Original author of Tweet
 * @param context_annotations
 * @param conversation_id ID for original Tweet in a conversation thread
 * @param created_at Time/Date when Tweet was posted
 * @param entities Object containing Tweet entities, usually links/tags/handles in `text`
 * @param geo Location attached to Tweet, if any
 * @param in_reply_to_user_id ID of Tweet recipent
 * @param lang Language of Tweet
 * @param non_public_metrics Metrics object that only the original poster can see, will throw error if original poster is not logged in
 * @param organic_metrics Private metrics
 * @param possibly_sensitive Returns true if the Tweet has been flagged by the Author or Twitter for NSFW/sensitive content
 * @param promoted_metrics Private metrics (Ad related)
 * @param public_metrics Metrics object containing information such as likes, retweets, comments etc.
 * @param referenced_tweets A list of Tweets this Tweet references, usually the Tweet it's retweeted or replied to
 * @param reply_settings Permission settings for replies, if you/anyone can reply
 * @param source If the Tweet has a source (articles)
 * @param withheld Information if the Tweet has been withheld in certain countries
 * 
 */
export type TweetFields = (
	//defaults
	'id' |
	'text' |

	//optional
	'attachments' |
	'author_id' |
	'context_annotations' |
	'conversation_id' |
	'created_at' |
	'entities' |
	'geo' |
	'in_reply_to_user_id' |
	'lang' |
	'non_public_metrics' |
	'organic_metrics' |
	'possibly_sensitive' |
	'promoted_metrics' |
	'public_metrics' |
	'referenced_tweets' |
	'reply_settings' |
	'source' |
	'withheld'
)[];

/**
 * Optional Media expansions, defaults are always returned even if not asked for.
 * 
 * @default media_key type
 * 
 * @param media_key ID for media, used for JSON lookup/matching
 * @param type `photo`, `animated_gif` or `video`
 * @param duration_ms Length of video in milliseconds, does not exist for `photo` or `animated_gif`
 * @param height Height of media
 * @param non_public_metrics Private metrics only accessible by original poster if logged in
 * @param organic_metrics Private metrics
 * @param preview_image_url Static poster/frame image of video or gif
 * @param promoted_metrics Private ad metrics
 * @param public_metrics Metrics object containing video watch count
 * @param url URL of photo media
 * @param width Width of media
 * @param alt_text Alternate text of the media to describe content
 * @param variants Contains video/animated_gif source urls and bitrates
 * 
 */
export type MediaFields = (
	//defaults
	'media_key' |
	'type' |

	//optional
	'duration_ms' |
	'height' |
	'non_public_metrics' |
	'organic_metrics' |
	'preview_image_url' |
	'promoted_metrics' |
	'public_metrics' |
	'url' |
	'width' |
	'alt_text' |
	'variants'
)[];

/**
 * Optional Place expansions, defaults are always returned even if not asked for.
 * 
 * @default id full_name
 * 
 */
export type PlaceFields = (
	//defaults
	'id' |
	'full_name' |

	//optional
	'contained_within' |
	'country' |
	'country_code' |
	'geo' |
	'name' |
	'place_type'
)[];

/**
 * Optional Poll expansions, defaults are always returned even if not asked for.
 * 
 * @default id options
 * 
 */
export type PollFields = (
	//defaults
	'id' |
	'options' |

	//optional
	'duration_minutes' |
	'end_datetime' |
	'voting_status'
)[];