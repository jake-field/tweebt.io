/** @type {import('tailwindcss').Config} */

module.exports = {
	darkMode: 'class',
	content: [
		'./src/app/**/*.{js,ts,jsx,tsx}', //NextJS 13 app folder
		'./src/pages/**/*.{js,ts,jsx,tsx}',
		'./src/common/**/*.{js,ts,jsx,tsx}',
		'./src/modules/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			keyframes: {
				scrolldemo: {
					'0%, 100%': { transform: 'translateY(-8rem)' },
					'50%': { transform: 'translateY(8rem)' },
				}
			},
			animation: {
				scrolldemo: 'scrolldemo 120s ease-in-out infinite'
			},
			screens: {
				'sm-h': { 'raw': '(min-height: 640px)' },
			},
		},
	},
	plugins: [],
}
