/** @type {import('tailwindcss').Config} */

module.exports = {
	darkMode: 'class',
	content: [
		"./src/app/**/*.{js,ts,jsx,tsx}", //NextJS 13 app folder
		"./src/pages/**/*.{js,ts,jsx,tsx}",
		"./src/common/**/*.{js,ts,jsx,tsx}",
		"./src/modules/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
	},
	plugins: [],
}
