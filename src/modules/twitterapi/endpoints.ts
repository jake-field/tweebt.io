const baseUrl = 'https://api.twitter.com';
const apiVers = '2';

async function callApi(url: string, token: string, params?: string) {
	const header: RequestInit = {
		headers: {
			Authorization: `Bearer ${token}`, //applies to both App token and User token for Twitter
			'Content-Type': 'application/json',
		},
		method: 'GET',
	};

	const target = `${baseUrl}/${apiVers}${url}` + (params ? `?${params}` : '');

	console.log(target);
	return fetch(target, header);
}

export const TwitterEndpoints = {
	getProfileById: (id: string, token: string, params?: string) => { return callApi(`/users/${id}`, token, params); },
	getProfileByHandle: (handle: string, token: string, params?: string) => { return callApi(`/users/by/username/${handle}`, token, params); },
	getMyFeed: (userId: string, token: string, params?: string) => { return callApi(`/users/${userId}/timelines/reverse_chronological`, token, params); },
	getUsersTweets: (profileId: string, token: string, params?: string) => { return callApi(`/users/${profileId}/tweets`, token, params); },
	getRecentTweets: (searchTerm: string, token: string, params?: string) => { return callApi('/tweets/search/recent', token, `query=${searchTerm}` + (params ? '&' : '') + params); },
}