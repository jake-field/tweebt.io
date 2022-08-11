import Link from "next/link";

//Returns a JSX element with formatted text
export default function FormatTwitterText(s: string, prettifyLinks?: boolean, linkLength?: number): JSX.Element {
	let t = s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

	return (
		<>
			{t.split(/(@\/?\w*)|(#[^.)( \n\t\r]+)|(https?:\/\/[\w.,-\/?&#=]*)/gi).map((str, i) => {
				if (!str) return;
				if (str.match(/^(@\/?\w*)|(^#.+)|^(https?:\/\/[\w.,-\/?&#=]*)/gi)) {
					return (
						<Link
							key={i}
							title={str.startsWith('#') ? `Search for ${str}` : str.startsWith('@') ? `Go to ${str}'s profile` : str}
							href={str.startsWith('#') ? `/search?q=${encodeURIComponent(str)}` : str.match(/^@\/?\w*/)?.at(0)?.replace('/', '') || str}
							target={str.match(/^[#@]/) ? '_self' : '_blank'}
							referrerPolicy='no-referrer'
							className='text-blue-500 hover:text-blue-400 dark:hover:text-blue-400'
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

export async function FormatTwitterTextAsync(s: string, prettifyLinks?: boolean, linkLength?: number): Promise<JSX.Element> {
	return new Promise((res, rej) => {
		try {
			res(FormatTwitterText(s, prettifyLinks, linkLength));
		} catch (err) {
			rej(err);
		}
	});
}