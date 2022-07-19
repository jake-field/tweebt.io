import { Session } from "next-auth"
import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import LoadingSpinner from "../../common/components/loadingspinner";
import Gallery from "../shared/types/gallery";
import Profile from "../shared/types/profile";
import GalleryComponent from "./components/gallery";

interface Props {
	session?: Session;
	profile: Profile;
}

export default function HandleFeed({ session, profile }: Props) {
	const router = useRouter();
	const [gallery, setGallery] = useState<Gallery[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		return () => {
			setGallery([]);
			console.log('cleared gallery');
		}
	}, [router]);

	useEffect(() => {
		if (gallery.length === 0 && !loading) fetchData();
	})

	function fetchData() {
		console.log('fetch request')
		if (loading) return;
		setLoading(true);
		console.log('fetch request in action');

		let pagination = '';
		if (gallery.length > 0) {
			const token = gallery[gallery.length - 1].meta?.next_token;
			pagination = token ? '&next=' + token : '';

			if (pagination === '') {
				console.log('tried to double request empty pagination')
				return;
			}
		}

		fetch(`/api/gallery/user/${profile.id}?&max_results=100${pagination}`) //exclude=replies,retweets
			.then((res) => {
				//intercept response status to catch errors
				if (res.status != 200) {
					//TODO: this should be refreshed using refresh tokens, please implement this ASAP
					signOut();
					router.push('/');
					throw res.statusText
				}
				return res
			})
			.then((res) => res.json())
			.then((data: Gallery) => {
				if (data.items && data.items.length > 0) {
					setGallery([...gallery, data]);
				}
			}).finally(() => {
				setLoading(false);
			}).catch(err => {
				console.log(err)
			});
	}

	function hasMore() {
		if (gallery.length > 0) {
			return gallery[gallery.length - 1].meta?.next_token ? true : false;
		}

		return (gallery.length === 0);
	}

	return (
		<div className="flex flex-col items-center w-full flex-1 text-center pt-10">
			<GalleryComponent gallery={gallery} loadNext={fetchData} canLoadMore={hasMore} />

			{(loading || hasMore()) &&
				<div className='flex flex-row items-center justify-center pb-10'>
					<LoadingSpinner className='w-10 h-10' />
				</div>
			}
		</div>
	)
}