/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: false, //When using dev, setting this to true causes double useEffect
	poweredByHeader: false,
	experimental: {
		appDir: true,
		//runtime: 'experimental-edge', //Cannot use this as it breaks next-auth sessions
	},
}

const ContentSecurityPolicy = `
	default-src 'self';
	img-src 'self' data:;
	script-src 'self' 'unsafe-eval' 'unsafe-inline';
	style-src 'self' 'unsafe-inline';
`

const securityHeaders = [
	{
		key: 'Strict-Transport-Security',
		value: 'max-age=63072000; includeSubDomains; preload'
	},
	{
		key: 'Content-Security-Policy',
		//key: 'Content-Security-Policy-Report-Only', //Debug only testing
		value: ContentSecurityPolicy.replace(/\s{2,}/g, ' ').trim()
	},
	{
		key: 'X-XSS-Protection',
		value: '1; mode=block'
	},
	{
		key: 'X-Frame-Options',
		value: 'SAMEORIGIN'
	},
	{
		key: 'X-Content-Type-Options',
		value: 'nosniff'
	},
	{
		key: 'Referrer-Policy',
		value: 'no-referrer-when-downgrade'
	}
]

module.exports = {
	...nextConfig,

	//Set up security headers
	async headers() {
		return [
			{
				//Apply to all routes
				source: '/:path*',
				headers: securityHeaders,
			}
		]
	},

	//Proxy for twitter content, helps with negating tracking and adblocker issues
	async rewrites() {
		return {
			beforeFiles: [
				//Generic proxy url crunching (Order matters)
				//videos
				{
					source: '/media/v/:id/:pu/:size/:file',
					destination: 'https://video.twimg.com/ext_tw_video/:id/:pu/vid/:size/:file',
				},
				{
					source: '/media/v/:id/:pu/:file',
					destination: 'https://pbs.twimg.com/ext_tw_video_thumb/:id/:pu/img/:file',
				},

				//amp videos
				{
					source: '/media/v2/:id/:size/:file',
					destination: 'https://video.twimg.com/amplify_video/:id/vid/:size/:file',
				},
				{
					source: '/media/v2/:id/:file',
					destination: 'https://pbs.twimg.com/amplify_video_thumb/:id/img/:file',
				},

				//gifs
				{
					source: '/media/v/:file.mp4',
					destination: 'https://video.twimg.com/tweet_video/:file.mp4',
				},
				{
					source: '/media/v/:file',
					destination: 'https://pbs.twimg.com/tweet_video_thumb/:file',
				},

				//profile pictures
				{
					source: '/media/:user/:file',
					destination: 'https://pbs.twimg.com/profile_images/:user/:file',
				},
				{
					source: '/media/user_:size',
					destination: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_:size',
				},

				//images
				{
					source: '/media/:file',
					destination: 'https://pbs.twimg.com/media/:file',
				},

				//catch-all url for anything new that pops up
				{
					source: '/tmedia/:s/:all*',
					destination: 'https://:s.twimg.com/:all*',
				},
			]
		}
	},
}