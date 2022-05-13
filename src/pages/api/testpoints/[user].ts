// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ApiError } from '../../../modules/twitter/types/errors';
import Timeline from '../../../modules/twitter/types/timeline';
import User from '../../../modules/twitter/types/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { query: { user }, method } = req;

	if (method !== 'GET') {
		res.setHeader('Allow', ['GET']);
		return res.status(405).end(`Method ${method} Not Allowed`);
	}

	if (!process.env.TWITTER_API_TOKEN) {
		return res.status(401).json({
			errors: [
				{ message: 'A Twitter API token is required to execute this request' },
			],
		})
	}

	//get userID
	let userRes = await fetch(
		`https://api.twitter.com/2/users/by/username/${user}`,
		{
			headers: {
				authorization: `Bearer ${process.env.TWITTER_API_TOKEN}`,
			},
		}
	)

	if (userRes.status != 200) {
		let apiError: ApiError = await userRes.json();
		return res.status(userRes.status).json(apiError);
	}

	console.log('rateLimitLeft (users/by/username/:username) = ' + userRes.headers.get('x-rate-limit-remaining'));

	let userJson: User = await userRes.json();
	if (userJson.data) {
		//get timeline
		let timelineRes = await fetch(
			`https://api.twitter.com/2/users/${userJson.data.id}/tweets`,
			{
				headers: {
					authorization: `Bearer ${process.env.TWITTER_API_TOKEN}`,
				},
			}
		)

		if (timelineRes.status != 200) {
			let apiError: ApiError = await timelineRes.json();
			return res.status(timelineRes.status).json(apiError);
		}

		console.log('rateLimitLeft (users/:id/tweets) = ' + timelineRes.headers.get('x-rate-limit-remaining'));

		let timelineJson: Timeline = await timelineRes.json();
		if (timelineJson.errors) return res.status(timelineRes.status).json(timelineJson);
		else return res.status(200).json(timelineJson);
	} else {
		return res.status(userRes.status).json(userJson);
	}
}