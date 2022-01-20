import { useState } from "react"
import styles from "../styles/Home.module.css"

import Loader from "../components/Loading"
import PostFeed from "../components/PostFeed"

import { firestore, postToJSON } from "../lib/firebase"
import {
	collectionGroup,
	where,
	orderBy,
	limit,
	query,
	getDocs,
	startAfter
} from "firebase/firestore"
import { Timestamp } from "firebase/firestore"

const { fromMillis } = Timestamp

const LIMIT = 5

export async function getServerSideProps(context) {
	const postQuery = collectionGroup(firestore, "posts")
	const w = where("published", "==", true)
	const order = orderBy("createdAt", "desc")
	const fLimit = limit(LIMIT)
	const q = query(postQuery, w, order, fLimit)

	const posts = (await getDocs(q)).docs.map(postToJSON)

	return {
		props: {
			posts
		}
	}
}

export default function Home(props) {
	const [posts, setPosts] = useState(props.posts)
	const [loading, setLoading] = useState(false)
	const [postsEnd, setPostsEnd] = useState(false)

	const getMorePosts = async () => {
		setLoading(true)
		const last = posts[posts.length - 1]

		const cursor =
			typeof last.createdAt === "number"
				? fromMillis(last.createdAt)
				: last.createdAt

		const collection = collectionGroup(firestore, "posts")
		const w = where("published", "==", true)
		const order = orderBy("createdAt", "desc")
		const fLimit = limit(LIMIT)
		const startA = startAfter(cursor)

		const q = query(collection, w, order, fLimit, startA)

		const newPosts = (await getDocs(q)).docs.map((doc) => doc.data())

		setPosts(posts.concat(newPosts))
		setLoading(false)

		if (newPosts.length < LIMIT) {
			setPostsEnd(true)
		}
	}

	return (
		<main styles={styles}>
			<PostFeed posts={posts} admin={false} />
			{!loading && !postsEnd ? (
				<button onClick={getMorePosts}>Load More</button>
			) : null}
			<Loader show={loading} />
			{postsEnd && "You have reached the end."}
		</main>
	)
}
