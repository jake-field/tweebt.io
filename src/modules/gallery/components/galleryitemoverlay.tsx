import { ProfileMediaItem } from "../../../common/types/profile";

interface Props {
	item: ProfileMediaItem;
	visible: boolean;
	showMetrics?: boolean;
}


export default function GalleryItemOverlay({ item, visible, showMetrics }: Props) {
	const iconClassName = 'w-5';
	const className = 'flex gap-1 transition-all ease-in-out duration-200 cursor-pointer text-white visited:text-white dark:text-white dark:visited:text-white ';

	function kFormatter(num: number) {
		return Math.abs(num) > 999 ? Math.sign(num) * Number((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
	}

	//force actions if touchscreen for now
	//consider putting this elsewhere or having a toggle
	if(window.matchMedia("(pointer: coarse)").matches) {
		// touchscreen
		visible = false; //disabled until I can get the UX better
		showMetrics = false;
	}

	return (
		<>
			<div className={`cursor-default relative flex h-0 w-full items-end transition-all ease-in-out duration-150 ${visible? 'bottom-0' : '-bottom-11'}`}>
				<div className='bg-black bg-opacity-70 backdrop-blur-sm text-white w-full flex justify-evenly items-center py-2 px-1'>
					<a
						title='Reply'
						className={className + ' hover:text-blue-400 dark:hover:text-blue-400'}
						href={`https://twitter.com/intent/tweet?in_reply_to=${item.tweetid}`}
						target='_blank'
					>
						<svg className={iconClassName} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path stroke='' fill='currentColor' d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.61 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path>
						</svg>
						{showMetrics && kFormatter(Number(item.replies))}
					</a>
					<a
						title='Retweet'
						className={className + ' hover:text-green-400 dark:hover:text-green-400'}
						href={`https://twitter.com/intent/retweet?tweet_id=${item.tweetid}`}
						target='_blank'
					>
						<svg className={iconClassName} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path stroke='' fill='currentColor' d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.337-.75-.75-.75z"></path>
						</svg>
						{showMetrics && kFormatter(Number(item.retweets))}
					</a>
					<a
						title='Like'
						className={className + ' hover:text-red-400 dark:hover:text-red-400'}
						href={`https://twitter.com/intent/like?tweet_id=${item.tweetid}`}
						target='_blank'
					>
						<svg className={iconClassName} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
							<path stroke='' fill='currentColor' d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z" />
						</svg>
						{showMetrics && kFormatter(Number(item.likes))}
					</a>
					<a
						title='View on Twitter'
						className={className + ' hover:text-blue-400 dark:hover:text-blue-400'}
						href={`https://twitter.com/${item.author}/status/${item.tweetid}`}
						target='_blank'
					>
						<svg className={iconClassName} viewBox="0 0 24 24">
							<path stroke='' fill='currentColor' d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
						</svg>
					</a>
				</div>
			</div>
		</>
	)
}