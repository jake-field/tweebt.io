/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: false, //when using dev, setting this to true causes double useEffect
	poweredByHeader: false,
}

const ContentSecurityPolicy = `
	default-src 'self';
	img-src 'self' data:;
	script-src 'self' 'unsafe-eval';
	style-src 'self' 'unsafe-inline';
`

const securityHeaders = [
	{
		key: 'Strict-Transport-Security',
		value: 'max-age=63072000; includeSubDomains; preload'
	},
	{
		key: 'Content-Security-Policy',
		//key: 'Content-Security-Policy-Report-Only',
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
		value: 'origin-when-cross-origin'
	}
]

module.exports = {
	...nextConfig,

	//set up security headers
	async headers() {
		return [
			{
				//Apply to all routes
				source: '/:path*',
				headers: securityHeaders,
			}
		]
	},

	//proxy for twitter content, helps with tracking and adblocker issues
	async rewrites() {
		return [
			{
				source: '/img/:path*',
				destination: 'https://pbs.twimg.com/:path*',
			},
			{
				source: '/staticimg/:path*',
				destination: 'https://abs.twimg.com/:path*',
			},
		]
	},
}