import styles from "../styles/Admin.module.css"

import Link from "next/link"
import { useRouter } from "next/router"

export default function PostFeed({ posts, admin }) {
	return posts
		? posts.map((post) => (
				<PostItem post={post} key={post.slug} admin={admin} />
		  ))
		: null
}

function EditButton({ post }) {
	return (
		<div className={styles.editBtnContainer}>
			<Link href={`/${post.username}`}>
				<a>
					<strong>By @{post.username}</strong>
				</a>
			</Link>
			<Link href={`/admin/${post.slug}`} passHref>
				<button type="button" className="btn-sm">
					Edit Post
				</button>
			</Link>
		</div>
	)
}

export function PostItem({ post }) {
	const wordCount = post?.content.trim().split(/\s+/g).length
	const minutesToRead = (wordCount / 100 + 1).toFixed(0)

	const router = useRouter()
	const isAdminPage = router.pathname === "/admin"

	return (
		<div className="card">
			{isAdminPage ? (
				<EditButton post={post} />
			) : (
				<div>
					By{" "}
					<Link href={`/${post.username}`}>
						<a>
							<strong>@{post.username}</strong>
						</a>
					</Link>
				</div>
			)}
			<Link href={`/${post.username}/${post.slug}`} passHref>
				<h2>
					<a>{post.title}</a>
				</h2>
			</Link>
			<footer>
				<span>
					{wordCount} word{wordCount !== 1 ? "s" : null}. {minutesToRead} min
					read
				</span>
				<span className="push-left">
					❤️ {post.heartCount} Heart{post.heartCount !== 1 ? "s" : null}
				</span>
			</footer>
		</div>
	)
}
