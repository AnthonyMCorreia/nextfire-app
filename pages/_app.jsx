import "bootstrap/dist/css/bootstrap.min.css"
import "../styles/globals.css"

import Navbar from "../components/Navbar"
import { Toaster } from "react-hot-toast"

import { UserContext } from "../lib/context"

import { AuthStateChange } from "../lib/hooks"

function MyApp({ Component, pageProps }) {
	const userData = AuthStateChange()

	return (
		<UserContext.Provider value={userData}>
			<Navbar />
			<Component {...pageProps} />
			<Toaster />
		</UserContext.Provider>
	)
}

export default MyApp
