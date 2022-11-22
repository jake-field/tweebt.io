'use client';

import { useEffect, useState } from 'react';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid';

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

	return (
		<span
			className='scrollTop'
			onClick={() => { if (visible) { scrollTo({ top: 0, behavior: 'smooth' }); setVisible(false); } }}
			style={{ transform: visible ? `translate(0, 0)` : undefined }}
		>
			<p>Scroll to Top</p>
			<ArrowUpCircleIcon className='w-6' />
		</span>
	)
}