import Link from "next/link";

//Returns a JSX element with formatted text
export default function FormatTwitterText(s: string, prettifyLinks?: boolean, linkLength?: number): JSX.Element {
	let t = s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

	return (
		<span className='whitespace-pre-wrap'>
			{t.split(/([#@]\/?\w*)|(http(s)?:\/\/[\w.,-\/?&#=]*)/gi).map((str, i) => {
				if (!str) return;
				if (str.match(/^([#@]\/?\w*)|^(http(s)?:\/\/[\w.,-\/?&#=]*)/gi)) {
					return (
						<Link
							key={i}
							title={str.startsWith('#') ? `Search for ${str}` : str.startsWith('@') ? `Go to ${str}'s profile` : str}
							href={str.startsWith('#') ? `/search?q=${encodeURIComponent(str)}` : str.match(/^@\/?\w*/)?.at(0)?.replace('/', '') || str}
							target={str.match(/^[#@]/) ? '_self' : '_blank'}
							referrerPolicy='no-referrer'
							className='text-blue-500 hover:text-blue-400 dark:hover:text-blue-400'
						>
							{prettifyLinks ? str.replace(/^(http(s)?:\/\/)/, '').substring(0, linkLength) : str}
						</Link>
					)
				} else {
					return str;
				}
			})}
		</span>
	);
}