'use client';

import { useEffect, useState } from 'react';

interface Dimensions {
	width?: number,
	height?: number,
}

function getWindowDimensions(): Dimensions {
	return { width: window.innerWidth, height: window.innerHeight };
}

export default function useWindowDimensions() {
	const [windowDimensions, setWindowDimensions] = useState<Dimensions>();

	useEffect(() => {
		setWindowDimensions(getWindowDimensions()); // Necessary to make sure dimensions are set upon initial load
		const handleResize = () => setTimeout(() => setWindowDimensions(getWindowDimensions()), 25); //slight delay to allow time for re-render
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowDimensions;
}