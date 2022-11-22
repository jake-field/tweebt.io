import Title from 'common/components/title';

interface Props {
	params: {
		query: string;
	}
}

export default async function Head({ params }: Props) {
	return (
		<Title
			url={`tweebt.io/search?q=${params.query}`}
			title={params.query}
			desc={`Image search results for ${params.query}`}
		/>
	)
}