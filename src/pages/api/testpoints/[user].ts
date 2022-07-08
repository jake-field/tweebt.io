// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from 'next-auth/jwt';
import { getSession } from 'next-auth/react';
import { ApiError } from '../../../modules/twitterapi/types/errors';
import Timeline from '../../../modules/twitterapi/types/timeline';
import User from '../../../modules/twitterapi/types/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { query: { user }, method } = req;
	const secret = process.env.NEXTAUTH_SECRET;
	const token = await getToken({ req, secret });
	const session = await getSession();

	if (method !== 'GET') {
		res.setHeader('Allow', ['GET']);
		return res.status(405).end(`Method ${method} Not Allowed`);
	}

	if (!token) {
		return res.status(401).json({
			errors: [
				{ message: 'no valid session' },
			],
		})
	}

	//get userID
	let userRes = await fetch(
		`https://api.twitter.com/2/users/1370142081851662337/timelines/reverse_chronological`,
		{
			headers: {
				authorization: `Bearer ${token.accessToken}`,
			},
		}
	)

	if (userRes.status != 200) {
		let apiError: ApiError = await userRes.json();
		return res.status(userRes.status).json(apiError);
	}

	res.status(userRes.status).json(await userRes.json());
}