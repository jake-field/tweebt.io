import Link from "next/link";
import { fixCarets, twitterTextSplitterRegex, twitterTextMatchRegex } from "./regextests";

//Returns a JSX element with formatted text
export default function FormatTwitterText(s: string, prettifyLinks?: boolean, linkLength?: number): JSX.Element {
	const t = fixCarets(s);
	return (
		<>
			{t.split(twitterTextSplitterRegex).map((str, i) => {
				if (str?.match(twitterTextMatchRegex)) {
					return (
						<Link
							key={i}
							title={str.startsWith('#') ? `Search for ${str}` : str.startsWith('@') ? `Go to ${str.replace('/', '')}'s profile` : str}
							href={str.startsWith('#') ? `/search?q=${encodeURIComponent(str)}` : str.match(/^@\/?\w*/)?.at(0)?.replace('/', '') || str}
							target={str.match(/^[#@]/) ? '_self' : '_blank'}
							referrerPolicy='no-referrer'
						>
							{prettifyLinks ? str.replace(/^(https?:\/\/)/, '').substring(0, linkLength) : str}
						</Link>
					)
				} else {
					return str;
				}
			})}
		</>
	);
}