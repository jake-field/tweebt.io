; (function initTheme() {
	switch (localStorage.getItem('theme') || 'sys') {
		case 'sys':
			if (!window.matchMedia('(prefers-color-scheme: dark)').matches) break;
		case 'dark':
			document.querySelector('html').classList.add('dark');
		default:
			break;
	}
})()