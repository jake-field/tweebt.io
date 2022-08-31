import { AnnotationIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";
import FormatTwitterText from "../../../common/utils/richtwittertext";
import { Media } from "../types/gallery"

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
	const buttonClass = 'absolute right-1 p-1 hover:ring-2 bg-black bg-opacity-70 pointer-events-auto rounded-md uppercase font-bold';
	const animClass = 'transition-opacity duration-100 ease-in-out';
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
		if (item.tweet.text && showTextButton) setFormattedText(FormatTwitterText(item.tweet.text));
		else setFormattedText(<></>);

		if (item.alt_text) setFormattedAltText(FormatTwitterText(item.alt_text));
		else setFormattedAltText(<></>);
	}, [item, showTextButton]);

	//close if parent closes
	useEffect(() => {
		if (!parentVisibility && showText !== null) setShowText(null);
	}, [parentVisibility, showText])

	return (
		<>
			<div
				className={`${animClass} top-0 left-0 p-2 flex-col gap-1 w-full h-full bg-black bg-opacity-90 overflow-y-auto ${showText ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
				onClick={() => setShowText(null)}
			>
				<p className='font-bold w-3/4 border-b border-gray-700'>{(showText === 'alt') && 'Alt Text:' || 'Tweet Text:'}</p>
				<span className='whitespace-normal'>
					{(showText === 'alt') && formattedAltText || formattedText}
				</span>
			</div>

			{item.alt_text && showAltButton &&
				<button
					title='Show Image Alt Text'
					className={`${buttonClass} ${animClass} bottom-1 text-xs px-2 ${parentVisibility ? 'opacity-100' : 'opacity-0'}`}

					onClick={() => toggleText(true)}
					onMouseEnter={() => { if (showOnHover) setShowText('alt') }}
					onBlur={() => clearText(clearDelay)}

					//fix for iOS
					onMouseLeave={() => { if (isAppleTouchDevice) clearText(clearDelay) }}
				>
					Alt
				</button>
			}

			{item.tweet.text && showTextButton &&
				<button
					title='Show Tweet Text'
					className={`${buttonClass} ${animClass} top-1 ${parentVisibility ? 'opacity-100' : 'opacity-0'}`}

					onClick={() => toggleText(false)}
					onMouseEnter={() => { if (showOnHover) setShowText('text') }}
					onBlur={() => clearText(clearDelay)}

					//fix for iOS
					onMouseLeave={() => { if (isAppleTouchDevice) clearText(clearDelay) }}
				>
					<AnnotationIcon className='w-4' />
				</button>
			}
		</>
	)
}