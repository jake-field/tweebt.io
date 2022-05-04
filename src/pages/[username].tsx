import { useRouter } from 'next/router';
import { useEffect, useState } from 'react'
import Title from '../common/components/title';
import GalleryMediaItem from '../modules/gallery/components/galleryitem';
import Placeholder from '../modules/gallery/components/placeholder';
import { Gallery } from '../modules/gallery/types/gallery';

export default function AtHandle() {
	const router = useRouter();
	const { username } = router.query;
	const [gallery, setGallery] = useState<Gallery | null>(null);
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		if (!username) return;
		setLoading(true);
		fetch(`api/${username}`)
			.then((res) => res.json())
			.then((data) => {
				setGallery(data);
				setLoading(false);
			});
	}, [username, setGallery, setLoading]);

	return (
		<div className="flex flex-col items-center justify-center min-h-screen py-2">
			<Title title={gallery ? `@${gallery.tweetMedia[0].author}` : undefined} />

			<div className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center mt-10">
				<h1 className="text-6xl font-bold">
					Tweebt gallery
				</h1>

				<p className="mt-3 text-2xl">
					tweebts of @{gallery?.tweetMedia[0].author}
				</p>

				<div className="flex flex-wrap items-center justify-center max-w-7xl mt-10 sm:w-full">
					{gallery && !isLoading ? (
						gallery?.tweetMedia.map(item => {
							return <GalleryMediaItem key={item.media_key} item={item} />
						})
					) : (
						<>
							<Placeholder />
							<Placeholder />
							<Placeholder />
						</>
					)}
				</div>
			</div>
		</div>
	)
}