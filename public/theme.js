; (function initTheme() {
	//detect device/system theme, and attempt to grab theme from local storage
	var sysTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	var theme = localStorage.getItem('theme') || 'auto';

	//add a storage item for general use system/device theme
	if (theme === 'auto') localStorage.setItem('sysTheme', sysTheme);

	//if theme is dark mode, or theme is auto and system/device is in dark mode
	if (theme === 'dark' || (theme === 'auto' && sysTheme === 'dark')) {
		document.querySelector('html').classList.add('dark');
	}
})()