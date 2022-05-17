; (function initTheme() {
	//var theme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

	//shortening it for now until it can be figured out why the page is flashing on reload.
	//consider setting bg to black until load for least amount of visual strain
	if (localStorage.getItem('theme') === 'dark') {
		document.querySelector('html').classList.add('dark')
	}
})()