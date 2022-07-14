import NavBar from "./navbar";
import ScrollTop from "./scrolltop";

export default function Layout({session, children }: any) {
	return (
		<>
			<main>
				<NavBar session={session} />
				<ScrollTop />
				{children}
			</main>
		</>
	)
}