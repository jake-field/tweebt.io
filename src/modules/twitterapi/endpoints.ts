const baseUrl = 'https://api.twitter.com';

async function callApi(url: string, token: string, params?: string) {
	const header: RequestInit = {
		headers: {
			Authorization: `Bearer ${token}`, //applies to both App token and User token for Twitter
			'Content-Type': 'application/json',
		},
		method: 'GET',
	};

	const target = `${baseUrl}${url}` + (params ? `?${params}` : '');
	return fetch(target, header);
}

export const TwitterEndpoints = {
	getProfileById: (id: string, token: string, params?: string) => { return callApi(`/2/users/${id}`, token, params); },
	getProfileByHandle: (handle: string, token: string, params?: string) => { return callApi(`/2/users/by/username/${handle}`, token, params); },
	getMyFeed: (userId: string, token: string, params?: string) => { return callApi(`/2/users/${userId}/timelines/reverse_chronological`, token, params); },
	getUsersTweets: (profileId: string, token: string, params?: string) => { return callApi(`/2/users/${profileId}/tweets`, token, params); },
	getRecentTweets: (searchTerm: string, token: string, params?: string) => { return callApi('/2/tweets/search/recent', token, `query=${searchTerm}` + (params ? '&' : '') + params); },
}