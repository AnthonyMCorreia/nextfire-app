import { useEffect, useState } from "react"
import { auth } from "./firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { doc, onSnapshot } from "firebase/firestore"
import { firestore } from "./firebase"

export const AuthStateChange = () => {
	const [user] = useAuthState(auth)
	const [username, setUsername] = useState(null)

	useEffect(() => {
		let unsubscribe

		if (user) {
			const ref = doc(firestore, "users", user.uid)

			unsubscribe = onSnapshot(ref, (doc) => {
				setUsername(doc.data()?.username)
			})
		} else {
			setUsername(null)
			unsubscribe = null
		}

		return unsubscribe
	}, [user])

	return { user, username }
}
