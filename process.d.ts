declare namespace NodeJS {
	export interface ProcessEnv {
		NEXTAUTH_URL: string
		NEXTAUTH_SECRET: string
		TWITTER_API_TOKEN: string
		TWITTER_CLIENT_ID: string
		TWITTER_CLIENT_SECRET: string
	}
}