/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false, //when using dev, setting this to true causes double useEffect
	images: {
		domains: ['pbs.twimg.com'], //for next/image security
	},
}

module.exports = nextConfig
