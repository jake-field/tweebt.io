import { PlayIcon } from "@heroicons/react/solid";
import { Media } from "../types/gallery";

interface Props {
	item: Media;
}

export default function VideoOverlay({ item }: Props) {
	const isRetweet = (item.ref_tweet?.type === 'retweeted') || false;
	const tweetHandle = isRetweet ? item.ref_tweet?.author.handle : item.tweet.author.handle;
	const tweetId = isRetweet ? item.ref_tweet?.id : item.tweet.id;
	return (
		<a
			href={`https://twitter.com/${tweetHandle}/status/${tweetId}`}
			className='flex items-center justify-center w-full h-full absolute'
			target='_blank'
			rel='noreferrer'
		>
			<span className='cursor-pointer z-10' title='Play video on Twitter'>
				<PlayIcon className='w-14 drop-shadow-md shadow-lg text-gray-100 hover:border-blue-600 hover:bg-blue-500 border-2 bg-gray-500 border-gray-600 rounded-full opacity-95' />
			</span>
		</a>
	)
}