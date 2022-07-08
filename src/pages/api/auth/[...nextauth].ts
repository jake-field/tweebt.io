import NextAuth from "next-auth"
import TwitterProvider from 'next-auth/providers/twitter'

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
	// https://next-auth.js.org/configuration/providers/oauth
	providers: [
		TwitterProvider({
			clientId: process.env.TWITTER_CLIENT_ID,
			clientSecret: process.env.TWITTER_CLIENT_SECRET,
			version: "2.0", // opt-in to Twitter OAuth 2.0
		})
	],
	theme: {
		colorScheme: "dark",
	},
	callbacks: {
		async jwt({ token, account }) {
			if (account?.access_token) token.accessToken = account.access_token;
			return token
		},
	},
})