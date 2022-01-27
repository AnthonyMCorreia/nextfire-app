import styles from "../../styles/Admin.module.css"

import AuthCheck from "../../components/AuthCheck"
import PostFeed from "../../components/PostFeed"
import { UserContext } from "../../lib/context"

import {
	firestore,
	auth,
	serverTimestamp,
	postToJSON
} from "../../lib/firebase"
import { doc, collection, orderBy, query, setDoc } from "firebase/firestore"

import { useContext, useState } from "react"
import { useRouter } from "next/router"

import {
	useCollection,
	useCollectionData
} from "react-firebase-hooks/firestore"
import kebabCase from "lodash.kebabcase"
import toast from "react-hot-toast"

export default function AdminPostsPage(props) {

	return (
		<main>
			<AuthCheck>
				<PostList />
				<CreateNewPost />
			</AuthCheck>
		</main>
	)
}

function PostList() {
	const users = collection(firestore, "users")
	const user = doc(users, auth.currentUser.uid)
	const postsColl = collection(user, "posts")
	const order = orderBy("createdAt", "desc")
	const q = query(postsColl, order)

	const [querySnapshot] = useCollection(q)
	let posts

	if (querySnapshot) {
		posts = querySnapshot.docs.map((doc) => doc.data())
	}

	return (
		<>
			<h1>Manage your Posts</h1>
			<PostFeed posts={posts} admin />
		</>
	)
}

function CreateNewPost() {
	const router = useRouter()
	const { username } = useContext(UserContext)
	const [title, setTitle] = useState("")

	//ensure slug is URL safe
	const slug = encodeURI(kebabCase(title))

	const isValid = title.length > 3 && title.length < 100

	const createPost = async (e) => {
		e.preventDefault()
		const uid = auth.currentUser.uid

		const users = collection(firestore, "users")
		const userDoc = doc(users, uid)
		const posts = collection(userDoc, "posts")
		const postDoc = doc(posts, slug)

		const data = {
			username,
			uid,
			title,
			slug,
			published: false,
			content: "Hello",
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
			heartCount: 0
		}

		await setDoc(postDoc, data)

		toast.success("Post created!")

		router.push(`/admin/${slug}`)

		return null
	}

	return (
		<form onSubmit={createPost}>
			<input
				type="text"
				onChange={(e) => setTitle(e.target.value)}
				value={title}
				placeholder="My Awesome Article"
				className={styles.input}
			/>
			<p>
				<strong>Slug:</strong> {slug}
			</p>
			<button type="submit" disabled={!isValid} className={"btn-green"}>
				Create New Post
			</button>
		</form>
	)
}
