import { useRouter } from "next/router"
import { useEffect } from "react";

export default function () {
	const { query } = useRouter();
	const slug = (query['query'] as string[] | undefined);

	useEffect(() => {
		console.log(query);
	}, [query]);

	return (
		<div>
			{`search queries: ${slug}`}
		</div>
	)
}