; (function initTheme() {
	var theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
	
	if (theme === 'dark') {
		document.querySelector('html').classList.add('dark')
	}
})()