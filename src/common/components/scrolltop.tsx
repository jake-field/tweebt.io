import { ArrowCircleUpIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";

export default function ScrollTop() {
	//DO NOT DO THIS, IT LAGS SO BAD
	// const [visible, setVisible] = useState(false);

	// function toggleVisible() {
	// 	setVisible(scrollY > 300);
	// }

	// //client side only code
	// if (typeof window !== "undefined") window.addEventListener('scroll', toggleVisible);

	const [visible, setVisible] = useState(false);

	//update event listener when visible is changed
	useEffect(() => {
		const scrollHandler = () => {
			if (!visible && scrollY > 300) setVisible(true);
			else if (visible && scrollY <= 300) setVisible(false);
		};

		window.addEventListener("scroll", scrollHandler);
		return () => window.removeEventListener("scroll", scrollHandler);
	}, [visible]);

	return (
		<span
			className='select-none z-50 fixed overflow-hidden hover:ring shadow-lg bottom-5 right-5 flex flex-row items-center justify-evenly w-fit h-10 p-2 gap-1 bg-slate-100 dark:bg-slate-700 rounded-full transition-all duration-300 ease-in-out'
			onClick={() => visible && scrollTo({ top: 0, behavior: 'smooth' })}
			style={{ opacity: visible ? '100' : '0', width: visible ? '130px' : '0px', cursor: visible ? 'pointer' : '' }}
		>
			<p className='uppercase text-xs whitespace-nowrap'>Scroll to Top</p>
			<ArrowCircleUpIcon className='w-6' />
		</span>
	)
}