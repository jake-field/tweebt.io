/** @type {import('next').NextConfig} */

const nextConfig = {
	reactStrictMode: false, //when using dev, setting this to true causes double useEffect
	darkMode: 'class',
	images: {
		domains: ['pbs.twimg.com', 'abs.twimg.com'], //for next/image security
	},
}

const ContentSecurityPolicy = `
	default-src 'self';
	img-src 'self' data:;
	script-src 'self' 'unsafe-eval';
	child-src 'self';
	style-src 'self' 'unsafe-inline';
	font-src 'self';  
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
	async headers() {
		return [
			{
				//Apply to all routes
				source: '/:path*',
				headers: securityHeaders,
			}
		]
	},
}