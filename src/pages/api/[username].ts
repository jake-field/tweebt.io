import { NextApiRequest, NextApiResponse } from "next";
import { getTimeline } from "../../modules/twitter/twitterapi";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { query: { username, next }, method } = req;

	//method check here
	//then check query count, should be just a string not string[]
	//do regex check and strip leading @ from handles if there is one
	//also do full error handling here

	let handle = username as string;
	handle = handle.replaceAll(/@/g, '');

	const result = await getTimeline(handle, next as string);

	if (result)
		return res.status(200).json(result);

	return res.status(500).end('failed');
}