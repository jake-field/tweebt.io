export type ExcludeFields = (
	//defaults

	//optional
	'retweets' |
	'replies'
)[];

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

export type UserFields = (
	//defaults
	'id' |
	'name' |
	'username' |

	//optional
	'created_at' |
	'description' |
	'entities' |
	'id' |
	'location' |
	'name' |
	'pinned_tweet_id' |
	'profile_image_url' |
	'protected' |
	'public_metrics' |
	'url' |
	'username' |
	'verified' |
	'withheld'
)[];

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
	'id' |
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
	'text' |
	'withheld'
)[];

export type MediaFields = (
	//defaults
	'media_key' |
	'type' |

	//optional
	'duration_ms' |
	'height' |
	'media_key' |
	'non_public_metrics' |
	'organic_metrics' |
	'preview_image_url' |
	'promoted_metrics' |
	'public_metrics' |
	'type' |
	'url' |
	'width' |
	'alt_text' |
	'variants'
)[];

export type PlaceFields = (
	//defaults
	'id' |
	'full_name' |

	//optional
	'contained_within' |
	'country' |
	'country_code' |
	'full_name' |
	'geo' |
	'id' |
	'name' |
	'place_type'
)[];

export type PollFields = (
	//defaults
	'id' |
	'options' |

	//optional
	'duration_minutes' |
	'end_datetime' |
	'id' |
	'options' |
	'voting_status'
)[];