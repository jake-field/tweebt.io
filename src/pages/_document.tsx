import { Html, Head, Main, NextScript } from 'next/document'
import Script from 'next/script'

export default function () {
	return (
		<Html lang='en'>
			<Head>
				<Script src="/theme.js" strategy="beforeInteractive" />
			</Head>
			<body className='dark:text-white bg-slate-200 dark:bg-slate-900'>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}