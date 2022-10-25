import styles from '../styles/tweet.module.css';
import { EyeOffIcon } from "@heroicons/react/outline";
import { useContext, useEffect, useState } from "react";
import { TileBlurContext } from "../../../common/contexts/appsettings/view";

export default function SpoilerOverlay() {
	const { blur } = useContext(TileBlurContext); //pull from settings context
	const [blurred, setBlurred] = useState(blur); //state
	useEffect(() => setBlurred(blur), [blur]); //when context updates, refresh blur state across all tiles

	return (
		<div className={styles.spoileroverlay} style={{ display: blurred ? 'flex' : 'none' }}>
			<EyeOffIcon />
			<span>Flagged as potentially sensitive content by author</span>
			<button type='button' className={styles.spoileraction} onClick={() => setBlurred(false)}>Show</button>
		</div>
	)
}