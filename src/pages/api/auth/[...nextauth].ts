import NextAuth, { NextAuthOptions } from 'next-auth'
import TwitterProvider from 'next-auth/providers/twitter'
import { JWT } from 'next-auth/jwt';
import ProxyUrl from '../../../common/utils/proxyurl';

interface TwitterRefreshToken {
	token_type: string;
	expires_in: number; //in seconds
	access_token?: string;
	scope?: string;
	refresh_token?: string;
}

//Twitter refresh token function
async function refreshAccessToken(token: JWT): Promise<JWT> {
	try {
		const url = `https://api.twitter.com/2/oauth2/token?grant_type=refresh_token&client_id=${process.env.TWITTER_CLIENT_ID}&refresh_token=${token.refreshToken}`;

		const response = await fetch(url, {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			method: 'POST',
		});

		const refreshedTokens = await response.json() as TwitterRefreshToken;

		if (!response.ok) {
			throw refreshedTokens;
		}

		const res: JWT = {
			...token,
			accessToken: refreshedTokens.access_token,
			accessTokenExpires: Date.now() + (refreshedTokens.expires_in * 1000), //Twitter provides this in relative seconds on refresh
			refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
		};

		return res;
	} catch (error) {

		return {
			...token,
			error: 'RefreshAccessTokenError',
		}
	}
}


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
					image: ProxyUrl(data.profile_image_url),
				};
			}
		}),
	],

	callbacks: {
		async jwt({ token, account }) {
			if (account) {
				token.accessToken = account.access_token; //expose access token
				token.accessTokenExpires = account.expires_at! * 1000; //Twitter gives us an absolute time on initial sign in (formatted in seconds)
				token.refreshToken = account.refresh_token; //expose refresh token to persist login
			}

			// Return previous token if the access token has not expired yet
			if (token.accessTokenExpires && (Date.now() < token.accessTokenExpires)) return token;

			// Access token has expired, try to update it
			return refreshAccessToken(token);
		},
	},
};

export default NextAuth(authOptions);