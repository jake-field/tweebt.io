import { EyeOffIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { MouseEventHandler, useState } from "react";
import LoadingSpinner from "../../../common/components/loadingspinner";
import { SettingsContext } from "../../../common/contexts/settingscontext";
import { Media } from "../../shared/types/gallery";
import GalleryItemOverlay from "./galleryitemoverlay";

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
			className='flex flex-col rounded-lg overflow-hidden items-center bg-slate-500 my-2 mx-1 shadow-lg cursor-pointer hover:ring-2 ring-blue-600 dark:ring-blue-400 border border-gray-500'
			onMouseOver={() => setHover(true)}
			onMouseOut={() => setHover(false)}
			style={{ contain: 'content' }}
		>
			{(!loaded || !imgVisible) &&
				<div className='absolute w-full h-full flex items-center justify-center'>
					<LoadingSpinner className={`w-5 h-5 transition-opacity ease-in-out duration-300 ${loaded ? 'opacity-0' : 'opacity-100'}`} />
				</div>
			}

			<GalleryItemOverlay item={item} visible={hover} showMetrics showTweetText>
				<span className='w-full'>
					{item.nsfw &&
						<SettingsContext.Consumer>
							{settings => (
								<>
									{(settings.blursensitive && blurred) &&
										<div className='absolute text-sm flex flex-col text-gray-200 gap-1 items-center justify-center w-full h-full z-10 bg-gray-800 backdrop-blur-lg bg-opacity-50 px-3'>
											<EyeOffIcon className='w-5' />
											<div className='px-3'>
												Marked as potentially sensitive content by author
											</div>
											<div className='bg-gray-600 text-white rounded-full px-3 py-1 shadow-lg cursor-pointer hover:bg-gray-700' onClick={() => setBlurred(false)}>
												Show
											</div>
										</div>
									}
								</>
							)}
						</SettingsContext.Consumer>
					}

					<Image
						src={item.url + '?name=small'} //pull smaller pre-compressed image from twitter
						width={item.width}
						height={item.height}
						placeholder='empty'
						//quality={75} //consider changing this, but this is acceptable for mosaic formatting
						unoptimized={true}
						onLoadingComplete={() => setLoaded(true)}
						onTransitionEnd={() => setImgVisible(true)}
						onClick={onClick}
						className={`transition-all hover:shadow-inner ease-in duration-150 ${loaded ? 'opacity-100' : 'opacity-0'}`}
						layout='responsive'
					/>
				</span>
			</GalleryItemOverlay>
		</div>
	);
}