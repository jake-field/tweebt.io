import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang='en'>
			<Head />
			<body className='dark:text-white bg-slate-200 dark:bg-slate-900'>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}