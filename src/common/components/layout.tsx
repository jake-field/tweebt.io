import Footer from './footer'
import Title from './title'

export default function Layout({ children }: any) {
	return (
		<>
			<Title />
			<main>{children}</main>
			<Footer />
		</>
	)
}