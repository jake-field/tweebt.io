import React from 'react';
import useStorageState, { StorageState } from '../utils/storage';

export class ImageQuality {
	/**
	 * If set, the image will be optimized by `sharp` (`next/Image`) via the proxy, so expect extra backend load.
	 * If unset (`undefined`), the image will be served directly via proxy to bypass adblockers.
	 * 
	 * - `optimize` should be either `undefined` or a number between `0` and `100` (treated as %)
	 */
	optimize: (number | undefined) = undefined;

	/**
	 * Quality of image to pull from Twitter. If imageOptimization is undefined, this is the image
	 * directly served 1:1 via proxy to the client, so larger files may take longer to render.
	 * 
	 * Consider the implications of using `'orig'`:
	 * - on mobile, low-end devices and slow or spotty connections
	 * - when `imageOptization` is enabled, as the server has to process these to the desired format
	 */
	twitterQuality: 'thumb' | 'small' | 'medium' | 'large' | 'orig' = 'medium';
}

class GenericView<T> extends StorageState<T> {
	imageSettings: ImageQuality = { optimize: undefined, twitterQuality: 'large' };
	hoverOverlay = true; //overlay details on hover instead of above/below image (pc only)
	layoutPosition: ('top' | 'bottom' | 'around') = 'around'; //place author & actions top/bottom/around of image
	textPosition: ('top' | 'bottom' | 'fill') = 'fill'; //place text top/bottom of image, or filled
	showAuthors = true; //show authors
	showMetrics = true; //show metric numbers (off by default on mobile)
	showActions = true; //show action buttons [reply, retweet, like] ... [link, share]?
	showSharing = true; //show share button [copy link, windows share]? ... [share sheet on mobile]
	showAltButton = true; //show button if alt text is available
	showTextButton = true; //show button if tweet text is available
	textHoverDelay: number | undefined = undefined; //show alt/tweet text on hover after [n]ms (pc only)
	richText = true; //enable links in tweet/alt text
}

export class ModalViewState extends GenericView<ModalViewState> { }

export class TileViewState extends GenericView<TileViewState> {
	imageSettings: ImageQuality = { optimize: undefined, twitterQuality: 'small' };
	autoplayGifs = true; //True by default
	autoplayVideos = false; //If true, videos will autoplay on the feed
	unmuteVideoOnHover = false; //If true, videos playing inline will unmute when user hovers over them
	showAuthorIfOwnProfile = false; //show author if it's their own post on their profile [@handle = item.author on profile page] (doesn't apply to replies/retweets)
}

export class BlurState extends StorageState<BlurState> {
	blur = true; //blur by default to prevent mishaps
}

//Contexts (default constructors are fine here)
export const TileBlurContext = React.createContext(new BlurState);
export const TileViewContext = React.createContext(new TileViewState);
export const ModalViewContext = React.createContext(new ModalViewState);

//Provider
export default function ViewProvider({ children }: any) {
	const [tileBlurState] = useStorageState('blurflagged', new BlurState);
	const [tileViewState] = useStorageState('tileview', new TileViewState);
	const [modalViewState] = useStorageState('modalview', new ModalViewState);

	//Provider consolidation in order of re-render significance/priority
	return (
		<ModalViewContext.Provider value={modalViewState}>
			<TileViewContext.Provider value={tileViewState}>
				<TileBlurContext.Provider value={tileBlurState}>
					{children}
				</TileBlurContext.Provider>
			</TileViewContext.Provider>
		</ModalViewContext.Provider>
	)
}