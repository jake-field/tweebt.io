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
			className='scrollTop'
			onClick={() => visible && scrollTo({ top: 0, behavior: 'smooth' })}
			style={{ transform: visible ? `translate(0, 0)` : undefined }}
		>
			<p>Scroll to Top</p>
			<ArrowCircleUpIcon className='w-6' />
		</span>
	)
}