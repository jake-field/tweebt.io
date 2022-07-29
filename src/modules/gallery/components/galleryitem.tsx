import { EyeOffIcon } from '@heroicons/react/outline';
import { PlayIcon } from '@heroicons/react/solid';
import Image from 'next/image';
import { MouseEventHandler, useState } from 'react';
import { SettingsContext } from '../../../common/contexts/settingscontext';
import { SpinnerIcon } from '../../../common/icons/spinnericon';
import { Media } from '../types/gallery';
import GalleryItemOverlay from './galleryitemoverlay';

interface Props {
	item: Media;
	onClick?: MouseEventHandler<HTMLDivElement>;
}

export default function GalleryMediaItem({ item, onClick }: Props) {
	const [loaded, setLoaded] = useState(false); //true when image loads
	const [imgVisible, setImgVisible] = useState(false); //true when image completes opacity animation
	const [hover, setHover] = useState(false);

	//TODO: consider using UseContext if possible, or figuring out a better way of doing this
	//		maybe when the blur sensitive global button is toggled, this should reset to that value?
	const [blurred, setBlurred] = useState(item.nsfw);

	return (
		<div
			className='flex flex-col rounded-lg overflow-hidden items-center my-2 mx-1 transition-all shadow-lg cursor-pointer hover:ring-2 ring-blue-600 dark:ring-blue-400'
			onMouseOver={() => setHover(true)}
			onMouseOut={() => setHover(false)}
			style={{ contain: 'content' }}
		>
			<GalleryItemOverlay item={item} visible={hover} showMetrics showTweetText>
				<span className='w-full min-h-[200px] inline-grid' style={{ contain: 'content' }}>
					{item.nsfw &&
						<SettingsContext.Consumer>
							{settings => (
								<>
									{(settings.blursensitive && blurred) &&
										<div className='absolute text-sm flex flex-col text-gray-200 gap-1 items-center justify-center w-full h-full z-20 bg-gray-800 backdrop-blur-lg bg-opacity-50 px-3'>
											<EyeOffIcon className='w-5' />
											<div className='px-3'>
												Marked as potentially sensitive content by author
											</div>
											<div className='bg-gray-600 text-white rounded-full border border-gray-400 px-3 py-1 shadow-lg cursor-pointer hover:bg-gray-700' onClick={() => setBlurred(false)}>
												Show
											</div>
										</div>
									}
								</>
							)}
						</SettingsContext.Consumer>
					}

					{(!loaded || !imgVisible) &&
						<span className='absolute w-full h-full flex items-center justify-center'>
							<SpinnerIcon className={`w-7 h-7 transition-opacity ease-in-out duration-300 ${loaded ? 'opacity-0' : 'opacity-100'}`} />
						</span>
					}

					{item.url.includes('video_thumb') && imgVisible && (item.referencing && item.referencing[0].type === 'retweeted' ? (
						<a
							href={`https://twitter.com/${item.referencing[0].username}/status/${item.referencing[0].tweet_id}`}
							className='flex items-center justify-center w-full h-full absolute'
							target='_blank'
						>
							<span className='cursor-pointer z-10' title='Play video on Twitter'>
								<PlayIcon className='w-14 drop-shadow-md shadow-lg text-gray-100 hover:border-blue-600 hover:bg-blue-500 border-2 bg-gray-500 border-gray-600 rounded-full opacity-95' />
							</span>
						</a>
					) : (
						<a
							href={`https://twitter.com/${item.author.username}/status/${item.tweet_id}`}
							className='flex items-center justify-center w-full h-full absolute'
							target='_blank'
						>
							<span className='cursor-pointer z-10' title='Play video on Twitter'>
								<PlayIcon className='w-14 drop-shadow-md shadow-lg text-gray-100 hover:border-blue-600 hover:bg-blue-500 border-2 bg-gray-500 border-gray-600 rounded-full opacity-95' />
							</span>
						</a>
					))}

					<Image
						src={item.url + '?name=small'} //pull smaller pre-compressed image from twitter
						width={item.width}
						height={item.height}
						alt={item.alt_text}
						placeholder='empty'
						//quality={75} //consider changing this, but this is acceptable for mosaic formatting
						unoptimized={true}
						onLoadingComplete={() => setLoaded(true)}
						onTransitionEnd={() => setImgVisible(true)}
						onClick={onClick}
						className={`transition-all object-cover hover:shadow-inner ease-in duration-150 ${loaded ? 'opacity-100' : 'opacity-0'}`}
						layout='responsive'
					/>
				</span>
			</GalleryItemOverlay>
		</div>
	);
}