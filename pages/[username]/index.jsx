import UserProfile from "../../components/UserProfile"
import PostFeed from "../../components/PostFeed"
import firestore, {
	orderBy,
	where,
	collection,
	limit,
	query,
	getDocs
} from "firebase/firestore"
import { getUserWithUsername, postToJSON } from "../../lib/firebase"

const fQuery = query

export async function getServerSideProps({ query: { username } }) {
	const userDoc = await getUserWithUsername(username)

	if (!userDoc) {
		return {
			notFound: true
		}
	}

	let user = null
	let posts = null

	if (userDoc) {
		user = userDoc.data()

		const postQuery = collection(userDoc.ref, "posts")

		const publishedCondition = where("published", "==", true)
		const orderByCreatedAt = orderBy("createdAt", "desc")
		const limitTo = limit(5)
		const q = await fQuery(
			postQuery,
			publishedCondition,
			orderByCreatedAt,
			limitTo
		)
		posts = (await getDocs(q)).docs.map(postToJSON)
	}

	return {
		props: {
			user,
			posts
		}
	}
}

export default function UserProfilePage({ user, posts }) {
	return (
		<main>
			<UserProfile user={user} />
			<PostFeed posts={posts} admin={false} />
		</main>
	)
}
