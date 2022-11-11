import styles from '../styles/tweettext.module.css';
import { useEffect, useState } from "react";
import formatTwitterText from "../../../common/utils/richtwittertext";
import { Media } from "../types/gallery.types"
import { ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/solid';

interface Props {
	item: Media;
	showAltButton?: boolean;
	showTextButton?: boolean;
	showOnHover?: boolean;
	parentVisibility?: boolean;
}

export default function TextOverlay({ item, showAltButton, showTextButton, showOnHover, parentVisibility }: Props) {
	const [showText, setShowText] = useState<'text' | 'alt' | null>(null);
	const [formattedText, setFormattedText] = useState<JSX.Element>(<></>);
	const [formattedAltText, setFormattedAltText] = useState<JSX.Element>(<></>);
	const clearDelay = 150; //delay before hiding text, this allows links to be clicked
	const isAppleTouchDevice = /iPhone|iPad|iPod/gi.test(navigator.userAgent) || (/AppleWebKit/gi.test(navigator.userAgent) && navigator.maxTouchPoints > 0);
	let timeoutObject: NodeJS.Timeout | undefined = undefined;

	function toggleText(alt: boolean) {
		clearTimeout(timeoutObject); //clear the timeout
		setShowText((alt && showText !== 'alt') ? 'alt' : (!alt && showText !== 'text') ? 'text' : null);
	}

	function clearText(ms?: number) {
		clearTimeout(timeoutObject); //clear the timeout
		if (ms) timeoutObject = setTimeout(() => setShowText(null), ms);
		else setShowText(null);
	}

	useEffect(() => {
		//don't load/store tweet-text in state if we don't show the button, to save DOM elements
		if (item.tweet.text && showTextButton) setFormattedText(formatTwitterText(item.tweet.text));
		else setFormattedText(<></>);

		if (item.alt_text) setFormattedAltText(formatTwitterText(item.alt_text));
		else setFormattedAltText(<></>);
	}, [item, showTextButton]);

	//close if parent closes
	useEffect(() => {
		if (!parentVisibility && showText !== null) setShowText(null);
	}, [parentVisibility, showText])

	return (
		<div className={`${styles.overlay} ${parentVisibility ? 'opacity-100' : 'opacity-0'}`}>
			<div
				className={`${showText ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
				onClick={() => setShowText(null)}
			>
				<p>{(showText === 'alt') ? 'Alt Text:' : 'Tweet Text:'}</p>
				<span>{(showText === 'alt') ? formattedAltText : formattedText}</span>
			</div>

			{showAltButton && item.alt_text &&
				<button
					title='Show Image Alt Text'
					type='button'
					className={`bottom-1 px-2`}
					onClick={() => toggleText(true)}
					onBlur={() => clearText(clearDelay)}
					onMouseEnter={() => { if (showOnHover) setShowText('alt') }}
					onMouseLeave={() => { if (isAppleTouchDevice) clearText(clearDelay) }} //fix for iOS
				>
					Alt
				</button>
			}

			{showTextButton && item.tweet.text &&
				<button
					title='Show Tweet Text'
					type='button'
					className={`top-1`}
					onClick={() => toggleText(false)}
					onBlur={() => clearText(clearDelay)}
					onMouseEnter={() => { if (showOnHover) setShowText('text') }}
					onMouseLeave={() => { if (isAppleTouchDevice) clearText(clearDelay) }} //fix for iOS
				>
					<ChatBubbleBottomCenterTextIcon />
				</button>
			}
		</div>
	)
}