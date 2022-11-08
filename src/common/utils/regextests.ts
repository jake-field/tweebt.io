const handleRegex = /^@[a-z0-9_]{1,15}$/i;
const inlineHandleRegex = /\B@[a-z0-9_]{1,15}/i;
const caretRegex = /(&lt;)?(&gt;)?(&amp;)?/gi;

export const twitterTextSplitterRegex = /(https?:\/\/[\w.,-\/?@&#=]*)|(\B@\/?[a-z0-9_]{1,15}\b)|(#[^.)( \n\t\r]{2,})/gi;
export const twitterTextMatchRegex = /^(https?:\/\/[\w.,-\/?@&#=]*)|^(\B@\/?[a-z0-9_]{1,15})|(^#.{2,})/i;

export function isValidHandle(handle: string, inline?: boolean) {
	return (inline ? inlineHandleRegex : handleRegex).test(handle);
}

export function fixCarets(str: string) {
	return str.replace(caretRegex, (match, c1, c2, c3) => {
		return c1 ? '<' : c2 ? '>' : c3 ? '&' : '';
	});
}