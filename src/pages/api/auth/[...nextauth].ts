import NextAuth, { NextAuthOptions } from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'

//seperate export for unstable_getServerSession
// see: https://next-auth.js.org/configuration/nextjs#unstable_getserversession
export const authOptions: NextAuthOptions = {
	providers: [
		TwitterProvider({
			clientId: process.env.TWITTER_CLIENT_ID,
			clientSecret: process.env.TWITTER_CLIENT_SECRET,
			version: '2.0', //Twitter OAuth 2.0

			//Replacing the profile function here so we can inject the twitter handle into the email
			profile({ data }) {
				return {
					id: data.id,
					name: data.name,
					email: data.username, //Use email section for twitter handle

					//relocate to local nextjs proxy to bypass adblockers
					image: data.profile_image_url.replace(/https:\/\/pbs.twimg.com\//, '/img/'),
				};
			}
		})
	],

	callbacks: {
		//TODO: expose refresh token and implement that
		async jwt({ token, account }) {
			if (account) token.accessToken = account.access_token; //expose access token
			return token;
		},
	},
};

export default NextAuth(authOptions);