import Image from "next/image";
import { useState } from "react";
import Modal from "../../../common/components/modal";
import { GalleryItem } from "../types/gallery";

interface Props {
	item: GalleryItem;
}

export default function GalleryMediaItem({ item }: Props) {
	const [imageOpen, setImageOpen] = useState(false);

	return (
		<a
			onClick={() => setImageOpen(!imageOpen)}
			// href={`https://twitter.com/${item.author}/status/${item.tweetid}`}
			className="m-1 rounded-xl overflow-hidden shadow-xl h-[150px]"
			target='_blank'
		>
			<Image className='object-cover' src={item.previmg} width={150} height={150} placeholder='empty' quality={100} />
			{imageOpen && <Modal galleryItem={item} />}
		</a>
	);
}