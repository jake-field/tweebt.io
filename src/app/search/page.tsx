interface Props {
	params: {};
	searchParams: {
		q: string;
	}
}

export default function Search({params, searchParams }:any) {
	return (
		<div>{searchParams.q}</div>
	)
}