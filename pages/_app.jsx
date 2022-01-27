// import "bootstrap/dist/css/bootstrap.css"
import "../styles/globals.css"
console.log()

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
