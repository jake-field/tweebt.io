import { ArrowCircleUpIcon } from '@heroicons/react/solid';
import { useEffect, useState } from 'react';

export default function ScrollTop() {
	const [visible, setVisible] = useState(false);
	const [intervalRef, setIntervalRef] = useState<NodeJS.Timeout | undefined>();

	//When visible changes state, refresh the interval that checks if we need to display this component
	useEffect(() => {
		const scrollHandler = () => {
			//checks here to avoid unnecessary state changes and re-renders
			if (!visible && scrollY > 300) setVisible(true);
			else if (visible && scrollY <= 300) setVisible(false);
		};

		//clear and refresh (needs to reset because of visible)
		clearInterval(intervalRef);
		setIntervalRef(setInterval(scrollHandler, 1000));

		return () => clearInterval(intervalRef);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [visible]);

	//
	// BELOW has been removed for now as it takes up a lot of CPU time as scroll is unhinged and fires non-stop
	// only re-enable it if the basic interval system above doesn't serve well enough
	//
	//update event listener when visible is changed
	// useEffect(() => {
	// 	const scrollHandler = () => {
	// 		//todo: consider debounce/throttling
	// 		if (!visible && scrollY > 300) setVisible(true);
	// 		else if (visible && scrollY <= 300) setVisible(false);
	// 	};

	// 	window.addEventListener('scroll', scrollHandler, { capture: true, passive: true });
	// 	return () => window.removeEventListener('scroll', scrollHandler);
	// }, [visible]);

	return (
		<span
			className='select-none z-50 fixed overflow-hidden hover:ring shadow-lg cursor-default bottom-5 right-5 flex flex-row items-center justify-evenly w-fit h-10 p-2 gap-1 bg-slate-100 dark:bg-slate-700 rounded-full transition-all duration-300 ease-in-out'
			onClick={() => visible && scrollTo({ top: 0, behavior: 'smooth' })}
			style={{ opacity: visible ? '100' : '0', width: visible ? '130px' : '0px', cursor: visible ? 'pointer' : 'default' }}
		>
			<p className='uppercase text-xs whitespace-nowrap'>Scroll to Top</p>
			<ArrowCircleUpIcon className='w-6' />
		</span>
	)
}