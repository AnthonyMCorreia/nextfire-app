import { initializeApp, getApps } from "firebase/app"
import {
	getAuth,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithRedirect
} from "firebase/auth"
import {
	getFirestore,
	collection,
	query,
	where,
	limit,
	getDocs,
	serverTimestamp as serverTime,
	increment as fIncrement
} from "firebase/firestore"
import {
	getStorage,
	uploadBytesResumable as uploadBytesResume
} from "firebase/storage"

const firebaseConfig = {
	apiKey: "AIzaSyD6YOpeBxDvkaeLSZnFLj_5MYX48MYFGzc",
	authDomain: "nextfire-fd967.firebaseapp.com",
	projectId: "nextfire-fd967",
	storageBucket: "nextfire-fd967.appspot.com",
	messagingSenderId: "83713537956",
	appId: "1:83713537956:web:60122d75b5baa7d9b23331"
}

if (!getApps().length) {
	initializeApp(firebaseConfig)
}

export const auth = getAuth()
export const googleAuth = new GoogleAuthProvider()
export const authChange = onAuthStateChanged
export const signInRedirect = signInWithRedirect

export const firestore = getFirestore()
export const serverTimestamp = serverTime
export const increment = fIncrement

export const storage = getStorage()
export const uploadBytesResumable = uploadBytesResume

export async function getUserWithUsername(username) {
	const userRef = collection(firestore, "users")
	const userQuery = query(userRef, where("username", "==", username), limit(1))
	const user = await getDocs(userQuery)

	return user.docs[0]
}

export function postToJSON(doc) {
	const data = doc.data()

	return {
		...data,
		createdAt: data.createdAt.toMillis(),
		updatedAt: data.updatedAt.toMillis()
	}
}
