import { NextApiRequest, NextApiResponse } from "next";
import { Response } from "../../../common/types/response";
import { getProfile } from "../../../modules/twitter/twitterapi";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	const { query: { handle }, method } = req;

	const result:Response = await getProfile(handle as string);

	if (result) return res.status(200).json(result);
	return res.status(500).end('failed');
}