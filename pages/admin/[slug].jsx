// /* eslint-disable @next/next/link-passhref */

import styles from "../../styles/Admin.module.css"
import { firestore, auth, serverTimestamp } from "../../lib/firebase"
import { collection, doc, updateDoc } from "firebase/firestore"

import AuthCheck from "../../components/AuthCheck"
import ImageUploader from "../../components/ImageUploader"

import { useState } from "react"
import { useRouter } from "next/router"

import { useDocumentData } from "react-firebase-hooks/firestore"
import { useForm } from "react-hook-form"
import ReactMarkdown from "react-markdown"
import Link from "next/link"
import toast from "react-hot-toast"

export default function AdminPostEdit() {
	return (
		<AuthCheck>
			<PostManager />
		</AuthCheck>
	)
}

function PostManager() {
	const [preview, setPreview] = useState(false)

	const router = useRouter()
	const { slug } = router.query

	const users = collection(firestore, "users")
	const user = doc(users, auth.currentUser.uid)
	const postsColl = collection(user, "posts")
	const postRef = doc(postsColl, slug)

	const [post] = useDocumentData(postRef)

	return (
		<main className={styles.container}>
			{post && (
				<>
					<section>
						<h1>{post.title}</h1>
						<p>ID: {post.slug}</p>

						<PostForm
							postRef={postRef}
							defaultValues={post}
							preview={preview}
						/>
					</section>
				</>
			)}
			<aside>
				<h3>Tools</h3>
				<button onClick={() => setPreview(!preview)}>
					{preview ? "Edit" : "Preview"}
				</button>
				{post ? (
					<Link href={`/${post.username}/${post.slug}`}>
						<button className="btn-blue">Live view</button>
					</Link>
				) : null}
			</aside>
		</main>
	)
}

function PostForm({ defaultValues, postRef, preview }) {
	const {
		register,
		handleSubmit,
		reset,
		watch,
		formState,
		formState: { errors }
	} = useForm({
		defaultValues,
		mode: "onChange"
	})

	const { isValid, isDirty } = formState

	const updatePost = async ({ content, published }) => {
		await updateDoc(postRef, {
			content,
			published,
			updatedAt: serverTimestamp()
		})

		reset({ content, published })

		toast.success("Post updated")
	}

	return (
		<form onSubmit={handleSubmit(updatePost)}>
			{preview && (
				<div className="card">
					<ReactMarkdown>{watch("content")}</ReactMarkdown>
				</div>
			)}
			<div className={preview ? styles.hidden : styles.controls}>
				<ImageUploader />
				<textarea
					name="content"
					{...register("content", {
						maxLength: { value: 2000, mesage: "content is too long" },
						minLength: { value: 10, message: "content is too short" },
						required: { value: true, message: "content is required" }
					})}></textarea>
				{errors.content && (
					<p className="text-danger">{errors.content.message}</p>
				)}

				<fieldset>
					<input
						id="published-check"
						className={styles.checkbox}
						name="published"
						type="checkbox"
						{...register("published")}
					/>
					<label htmlFor="published-check">Published</label>
				</fieldset>
				<button
					className="btn-green"
					type="submit"
					disabled={!isDirty || !isValid}>
					Save Changes
				</button>
			</div>
		</form>
	)
}
