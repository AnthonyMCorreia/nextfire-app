import styles from "../../styles/Post.module.css"
import ErrorPage from "../404"

import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase"
import { useDocumentData } from "react-firebase-hooks/firestore"
import {
	collection,
	getDocs,
	getDoc,
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
		const posts = collection(userDoc.ref, "posts")
		const postRef = doc(posts, slug)

		const nonJSONPost = await getDoc(postRef)

		if (!nonJSONPost.exists()) {
			return {
				notFound: true
			}
		}

		post = postToJSON(nonJSONPost)
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
		<>
			{post ? (
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
								<Link href="/enter" passHref>
									<button>❤️ Sign Up</button>
								</Link>
							}>
							<HeartButton postRef={postRef} />
						</AuthCheck>
					</aside>
				</main>
			) : (
				<ErrorPage />
			)}
		</>
	)
}
