const handleRegex = /^@{0,1}[a-z0-9_]{1,15}$/i;

export function validateHandle(handle: string) {
	return handleRegex.test(handle);
}