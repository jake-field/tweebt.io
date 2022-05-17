import { NextApiRequest, NextApiResponse } from "next";
import { getProfileMedia } from "../../modules/twitter/twitterapi";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { query: { username, next, until }, method } = req;

	//method check here
	//then check query count, should be just a string not string[]
	//do regex check and strip leading @ from handles if there is one
	//also do full error handling here

	let handle = username as string;
	handle = handle.replaceAll(/@/g, '');

	const result = await getProfileMedia(handle, { token: next as string, oldest_id: until as string });

	if (result)
		return res.status(200).json(result);

	return res.status(500).end('failed');
}