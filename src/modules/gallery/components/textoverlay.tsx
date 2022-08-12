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

	function toggleText(alt: boolean) {
		setShowText((alt && showText !== 'alt') ? 'alt' : (!alt && showText !== 'text') ? 'text' : null);
	}

	useEffect(() => {
		//don't load/store tweet-text in state if we don't show the button, to save DOM elements
		if (item.text && showTextButton) setFormattedText(FormatTwitterText(item.text));
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
				className='top-0 left-0 p-2 flex-col gap-1 w-full h-full bg-black bg-opacity-90 pointer-events-auto'
				style={{ display: showText ? 'flex' : 'none' }}
				onClick={() => setShowText(null)}
			>
				<p className='font-bold w-3/4 border-b border-gray-700'>{(showText === 'alt') && 'Alt Text:' || 'Tweet Text:'}</p>
				<span className='whitespace-normal'>
					{(showText === 'alt') && formattedAltText || formattedText}
				</span>
			</div>

			{item.alt_text &&
				<button
					title='Show Image Alt Text'
					className={`${buttonClass} bottom-1 px-2 ${showAltButton && parentVisibility ? 'block' : 'hidden'}`}

					onClick={() => toggleText(true)}
					onMouseEnter={() => { if (showOnHover) setShowText('alt') }}
					onBlur={() => setShowText(null)}

					//fix for iOS
					onMouseLeave={() => { if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) setShowText(null) }}
				>
					Alt
				</button>
			}

			{item.text &&
				<button
					title='Show Tweet Text'
					className={`${buttonClass} top-1 ${showTextButton && parentVisibility ? 'block' : 'hidden'}`}

					onClick={() => toggleText(false)}
					onMouseEnter={() => { if (showOnHover) setShowText('text') }}
					onBlur={() => setShowText(null)}

					//fix for iOS
					onMouseLeave={() => { if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) setShowText(null) }}
				>
					<AnnotationIcon className='w-4' />
				</button>
			}
		</>
	)
}