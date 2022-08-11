; (function initTheme() {
	//detect device/system theme, and attempt to grab theme from local storage
	var sysTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	var theme = localStorage.getItem('theme') || 'sys';

	//if theme is dark mode, or theme is auto and system/device is in dark mode
	if (theme === 'dark' || (theme === 'sys' && sysTheme === 'dark')) {
		document.querySelector('html').classList.add('dark');
	}
})()