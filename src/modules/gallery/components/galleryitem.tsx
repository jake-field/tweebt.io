import Image from "next/image";
import { GalleryItem } from "../types/gallery";

interface Props {
	item: GalleryItem;
}

export default function GalleryMediaItem({ item }: Props) {
	return (
		<a
			href={`https://twitter.com/${item.author}/status/${item.tweetid}`}
			className="m-1 rounded-xl overflow-hidden shadow-xl"
			style={{ width: 150, height: 150 }}
		>
			<Image src={item.previmg} width={150} height={150} placeholder='empty' quality={100} />
		</a>
	);
}