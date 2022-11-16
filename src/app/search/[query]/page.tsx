import { unstable_getServerSession } from "next-auth";
import NavBar from "../../../common/components/navbar";
import Feed from "../../../modules/gallery/components/feed";

interface Props {
	params: {
		query: string;
	}
}

export default async function Search({ params }: Props) {
	const session = await unstable_getServerSession() || undefined;

	return (
		<div className='flex flex-col items-center w-full'>
			<NavBar session={session} searchBarValue={params.query} /> {/* TODO: remove when layout supports getting path */}
			<Feed searchQuery={params.query} />
		</div>
	)
}