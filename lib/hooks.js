import { useEffect, useState } from "react"
import { auth } from "./firebase"
import { useAuthState } from "react-firebase-hooks/auth"
import { doc, onSnapshot } from "firebase/firestore"
import { firestore, storage } from "./firebase"
import { ref, listAll, getDownloadURL, getMetadata } from "firebase/storage"

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

export const GetPics = (uid) => {
	const [list, setList] = useState([])
	useEffect(() => {
		async function inner() {
			const userStorage = ref(storage, `uploads/${uid}`)
			const { items } = await listAll(userStorage)

			items.forEach(async (item) => {
				const index = item.name.match(/\d+/g)[0]
				const link = await getDownloadURL(item)

				if (!list.find((item) => item.index === index)) {
					setList([...list, { link, index }])
				}
			})
		}

		inner()
	}, [list])

	const sortedList = list.sort((a, b) => a.index - b.index)

	return sortedList
}
