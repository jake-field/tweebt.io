import { EyeOffIcon } from "@heroicons/react/outline";
import { useContext, useEffect, useState } from "react";
import { BlurContext } from "../../../common/contexts/appsettings/blur";

export default function SpoilerOverlay() {
	const { blur } = useContext(BlurContext);
	const [blurred, setBlurred] = useState(blur);
	useEffect(() => setBlurred(blur), [blur]);

	return (
		<div
			className='cursor-default absolute text-sm flex-col text-gray-200 gap-1 items-center justify-center w-full h-full z-20 bg-gray-800 backdrop-blur-lg bg-opacity-50'
			style={{ display: blurred ? 'flex' : 'none' }}
		>
			<EyeOffIcon className='w-5' />

			<span className='px-3'>
				Flagged as potentially sensitive content by author
			</span>

			<button className='bg-gray-600 text-white rounded-full border border-gray-400 px-3 py-1 hover:bg-gray-700' onClick={() => setBlurred(false)}>
				Show
			</button>
		</div>
	)
}