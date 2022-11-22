import 'next-auth/jwt'

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken?: string,
		accessTokenExpires?: number,
		refreshToken?: string,
	}
}