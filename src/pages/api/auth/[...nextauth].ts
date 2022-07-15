import NextAuth from "next-auth"
import TwitterProvider from 'next-auth/providers/twitter'

export default NextAuth({
	providers: [
		TwitterProvider({
			clientId: process.env.TWITTER_CLIENT_ID,
			clientSecret: process.env.TWITTER_CLIENT_SECRET,
			version: "2.0", // opt-in to Twitter OAuth 2.0
		})
	],
	callbacks: {
		async session({ session, user, token }) {
			if (session.user) session.user.id = token.sub;
			return session;
		},

		async jwt({ token, account, user, profile }) {
			if (account) token.accessToken = account.access_token;
			console.log(account);
			return token;
		},
	},
})