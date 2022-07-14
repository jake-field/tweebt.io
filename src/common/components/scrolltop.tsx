import { ArrowCircleUpIcon } from "@heroicons/react/solid";
import { useState } from "react";

export default function ScrollTop() {
	const [visible, setVisible] = useState(false);

	function toggleVisible() {
		setVisible(scrollY > 300);
	}

	//client side only code
	if (typeof window !== "undefined") window.addEventListener('scroll', toggleVisible);

	return (
		<span
			className='select-none z-50 fixed overflow-hidden shadow-lg bottom-5 right-5 flex flex-row items-center justify-evenly w-fit h-10 p-2 gap-1 bg-slate-100 dark:bg-slate-700 rounded-full transition-all duration-300 ease-in-out'
			onClick={() => visible && scrollTo({ top: 0, behavior: 'smooth' })}
			style={{ opacity: visible ? '100' : '0', width: visible ? '130px' : '0px' }}
		>
			<p className='uppercase text-xs whitespace-nowrap'>Scroll to Top</p>
			<ArrowCircleUpIcon className='w-6' />
		</span>
	)
}