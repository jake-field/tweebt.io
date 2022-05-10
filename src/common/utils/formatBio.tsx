import Link from "next/link";

interface Props {
	bio: string;
}

export default function FormatBio({ bio }: Props) {
	const urlReg = /((?:https?\:\/\/)?(?:[^ ]*\.)?[a-zA-Z0-9-]*\.\w{1,3}(?:\/[a-zA-Z0-9?=#%&,_-]*)?)/gi;
	const array = bio.split(/(#\w*)|(@\w*)|((?:https?\:\/\/)?(?:[^ ]*\.)?[a-zA-Z0-9-]*\.\w{1,3}(?:\/[a-zA-Z0-9?=#%&,_-]*)?)/gi);
	return (
		<>
			{array.map(str => {
				if (!str) return;
				if (urlReg.test(str)) {
					return <a key={str} href={`https://${str}`} target='_blank'>{str}</a>
				}
				else if (str.startsWith('#')) {
					return <a key={str} href={`https://twitter.com/search?q=${encodeURIComponent(str)}`} target='_blank'>{str}</a>
				}
				else if (str.startsWith('@')) {
					return <Link key={str} href={`/${str}`}>{str}</Link>
				} else {
					return str;
				}
			})}
		</>
	)
}