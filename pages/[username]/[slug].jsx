import styles from "../../styles/Post.module.css"

import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase"
import { useDocumentData } from "react-firebase-hooks/firestore"
import {
	collection,
	getDocs,
	collectionGroup,
	limit,
	query,
	doc
} from "firebase/firestore"

import Link from "next/link"

import PostContent from "../../components/PostContent"
import Metatags from "../../components/Metatags"
import HeartButton from "../../components/HeartButton"
import AuthCheck from "../../components/AuthCheck"

export async function getStaticProps({ params }) {
	const { username, slug } = params
	const userDoc = await getUserWithUsername(username)

	let post
	let path

	if (userDoc) {
		const postsQuery = query(collection(userDoc.ref, "posts"), limit(1))

		const posts = (await getDocs(postsQuery)).docs.map(postToJSON)
		post = posts[0]

		const postRef = doc(userDoc.ref, "posts", slug)

		path = postRef.path
	}

	return {
		props: { post, path },
		revalidate: 5000
	}
}

export async function getStaticPaths() {
	const coll = collectionGroup(firestore, "posts")
	const snapshot = await getDocs(coll)

	const paths = snapshot.docs.map((doc) => {
		const { slug, username } = doc.data()
		return {
			params: { username, slug }
		}
	})

	return {
		paths,
		fallback: "blocking"
	}
}

export default function Post(props) {
	const postRef = doc(firestore, props.path)
	const [realtimePost] = useDocumentData(postRef)

	let post = realtimePost || props.post

	return (
		<main className={styles.container}>
			<Metatags title={post.title} />
			<section>
				<PostContent post={post} />
			</section>
			<aside className="card">
				<p>
					<strong>{post.heartCount || 0} ❤️</strong>
				</p>

				<AuthCheck
					fallback={
						<Link href="/enter">
							<button>❤️ Sign Up</button>
						</Link>
					}>
					<HeartButton postRef={postRef} />
				</AuthCheck>
			</aside>
		</main>
	)
}
