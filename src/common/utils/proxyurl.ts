export default function proxyUrl(url?: string) {
	return url?.
		//static
		replace(/https:\/\/abs.twimg.com\/sticky\/default_profile_images\/default_profile/, '/media/user').

		//image
		replace(/https:\/\/pbs.twimg.com\/(media|profile_images)\//, '/media/').

		//videos
		replace(/https:\/\/(?:video|pbs).twimg.com\/ext_tw_video(?:_thumb)?\/(.+)\/(p[u|r])\/(?:vid|img)\//, '/media/v/$1/$2/').
		replace(/https:\/\/(?:video|pbs).twimg.com\/amplify_video(?:_thumb)?\/(.+)\/(?:vid|img)\//, '/media/v2/$1/').

		//gifs
		replace(/https:\/\/(video|pbs).twimg.com\/tweet_video(_thumb)?\//, '/media/v/');
}