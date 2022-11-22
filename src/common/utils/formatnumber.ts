import moment from 'moment';

//Format a number such that 10,500 becomes 10.5k
export function formatNumber(n: number, precision: number = 1) {
	return n > 999 ? (n / 1000).toFixed(precision) + 'k' : n;
}

//small helper for numbers
export function pluralize(n: number, str: string, singular = '', plural = 's') {
	return `${n.toLocaleString()} ${str}${n === 1 ? singular : plural}`;
}

//helper for dates
export function formatTimeAgo(date: string) {
	return moment(date).fromNow();
}

export function shortenTimeAgo(str: string) {
	return str.replace(/^([0-9]*|an?)(?: few)? (\w*) ago/, (match, c1, c2) => {
		return c1.replace(/an?/, '1') + c2.replace(/^([smdy]o?|h).*/, '$1');
	});
}