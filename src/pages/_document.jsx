// import { Html, Head, Main, NextScript } from 'next/document'
// import Script from 'next/script'

// export default function Document() {
// 	return (
// 		<Html lang='en'>
// 			<Script src='/theme.js' strategy='beforeInteractive' />
// 			<Head />
// 			<body className='dark:text-white bg-slate-200 dark:bg-slate-900'>
// 				<Main />
// 			</body>
// 			<NextScript />
// 		</Html>
// 	)
// }

import Document, { Html, Head, Main, NextScript } from 'next/document';

//TODO: Replace this with next13 ./app/layout.tsx
//Temporary cookie based theme document, replaced as JSX file (was TSX) for typing
class CustomDocument extends Document {
    static async getInitialProps(ctx) {
        let pageProps = null;
        const originalRenderPage = ctx.renderPage;
        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: (App) => (props) => {
                    pageProps = props.pageProps;
                    return <App {...props} />
                },
                enhanceComponent: (Component) => Component,
            })

        const initialProps = await Document.getInitialProps(ctx);
        return { ...initialProps, pageProps }
    }

    render() {
        const { pageProps } = this.props;

        return (
            <Html lang='en' className={pageProps.darkmode ? 'dark' : ''}>
                <Head />
                <body className='dark:text-white bg-slate-200 dark:bg-slate-900'>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default CustomDocument;