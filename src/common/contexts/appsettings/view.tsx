import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

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
	 * Consider the implications of using `"orig"`:
	 * - on mobile, low-end devices and slow or spotty connections
	 * - when `imageOptization` is enabled, as the server has to process these to the desired format
	 */
	twitterQuality: 'thumb' | 'small' | 'medium' | 'large' | 'orig' = 'medium';
}

export class ModalViewState {
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

	//functions
	set = (params: Partial<ModalViewState>) => { };
}

export class TileViewState extends ModalViewState {
	imageSettings: ImageQuality = { optimize: undefined, twitterQuality: 'small' };
	showAuthorIfOwnProfile = false; //show author if it's their own post on their profile [@handle = item.author on profile page] (doesn't apply to replies/retweets)

	//functions
	set = (params: Partial<TileViewState>) => { };
}

export class BlurState {
	blur = true; //blur by default to prevent mishaps
	toggle = () => { };
	set = (blur: boolean) => { };
}

//Contexts
export const TileBlurContext = React.createContext(new BlurState);
export const TileViewContext = React.createContext(new TileViewState);
export const ModalViewContext = React.createContext(new ModalViewState);

//Provider
export default function ViewProvider({ children }: any) {
	const router = useRouter(); //used for checking for state updates on router update
	let [tileBlurState, setTileBlurState] = useState<BlurState>(new BlurState);
	let [tileViewState, setTileViewState] = useState<TileViewState>(new TileViewState);
	let [modalViewState, setModalViewState] = useState<ModalViewState>(new ModalViewState);

	//context functions
	tileBlurState.toggle = () => setTileBlurState({ ...tileBlurState, blur: !tileBlurState.blur });
	tileBlurState.set = (blur: boolean) => setTileBlurState({ ...tileBlurState, blur });
	tileViewState.set = (params: Partial<TileViewState>) => setTileViewState({ ...tileViewState, ...params });
	modalViewState.set = (params: Partial<ModalViewState>) => setModalViewState({ ...modalViewState, ...params });

	//TODO: tidy up repetitive code here
	//Update states when they differ from local storage
	useEffect(() => {
		const blurflagged = localStorage['blurflagged'];
		if (blurflagged && blurflagged !== String(tileBlurState.blur)) {
			console.log('pullStorage:', 'blurflagged');
			tileBlurState.set(blurflagged === 'true');
		}

		const tileview = localStorage['tileview'];
		if (tileview && tileview !== JSON.stringify(tileViewState)) {
			console.log('pullStorage:', 'tileview');
			const state = JSON.parse(tileview) as Partial<TileViewState>;
			tileViewState.set({ ...tileViewState, ...state });
		}

		const modalview = localStorage['modalview'];
		if (modalview && modalview !== JSON.stringify(modalViewState)) {
			console.log('pullStorage:', 'modalview');
			const state = JSON.parse(modalview) as Partial<ModalViewState>;
			modalViewState.set({ ...modalViewState, ...state });
		}

		//TODO: disabling eslint here until I fix this, but this is the effect we want right now
		// eslint-disable-next-line
	}, [router]);

	//Update local storage values when states change
	useEffect(() => {
		if (localStorage['blurflagged'] === String(tileBlurState.blur)) return;
		console.log('updateStorage:', 'blurflagged', tileBlurState.blur);
		localStorage['blurflagged'] = tileBlurState.blur;
	}, [tileBlurState]);

	useEffect(() => {
		if (localStorage['tileview'] === JSON.stringify(tileViewState)) return;
		console.log('updateStorage:', 'tileview', tileViewState);
		localStorage['tileview'] = JSON.stringify(tileViewState);
	}, [tileViewState]);

	useEffect(() => {
		if (localStorage['modalview'] === JSON.stringify(modalViewState)) return;
		console.log('updateStorage:', 'modalview', modalViewState);
		localStorage['modalview'] = JSON.stringify(modalViewState);
	}, [modalViewState]);

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