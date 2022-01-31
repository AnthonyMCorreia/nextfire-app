/* eslint-disable @next/next/no-img-element */
import styles from "../../styles/Admin.module.css"

import {
	firestore,
	auth,
	serverTimestamp,
	getUserPictures,
	storage
} from "../../lib/firebase"
import { collection, doc, updateDoc, deleteDoc } from "firebase/firestore"
import {
	getDownloadURL,
	ref,
	listALl,
	listAll,
	getMetadata
} from "firebase/storage"

import AuthCheck from "../../components/AuthCheck"
import ImageUploader from "../../components/ImageUploader"

import { useState, useRef, useContext, useEffect } from "react"
import { useRouter } from "next/router"

import { useDocumentData } from "react-firebase-hooks/firestore"
import { useForm } from "react-hook-form"
import { GetPics } from "../../lib/hooks"
import ReactMarkdown from "react-markdown"
import Link from "next/link"
import toast from "react-hot-toast"
import {
	Modal,
	Button,
	Dropdown,
	Popover,
	Container,
	DropdownButton,
	ListGroup,
	Image
} from "react-bootstrap"

import { UserContext } from "../../lib/context"

export default function AdminPostEdit() {
	return (
		<AuthCheck>
			<PostManager />
		</AuthCheck>
	)
}

function PostManager() {
	const [preview, setPreview] = useState(false)
	const [show, setShow] = useState(false)

	const handleClose = () => setShow(false)
	const handleShow = () => setShow(true)

	const router = useRouter()
	const { slug } = router.query

	const users = collection(firestore, "users")
	const user = doc(users, auth.currentUser.uid)
	const postsColl = collection(user, "posts")
	const postRef = doc(postsColl, slug)

	const [post] = useDocumentData(postRef)

	const deletePost = async (e) => {
		e.preventDefault()

		await deleteDoc(postRef)

		toast.success("Post deleted")

		router.push("/admin")
	}

	return (
		<>
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
				{post && (
					<SideOptions
						post={post}
						preview={preview}
						handleShow={handleShow}
						setPreview={setPreview}
					/>
				)}
			</main>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Delete post</Modal.Title>
				</Modal.Header>
				<Modal.Body>Are you sure you want to delete this post?</Modal.Body>
				<Modal.Footer>
					<Button variant="primary" onClick={handleClose}>
						Close
					</Button>
					<Button variant="red" onClick={deletePost}>
						Delete
					</Button>
				</Modal.Footer>
			</Modal>
		</>
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
					/>{" "}
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

function SideOptions({ post, preview, handleShow, setPreview }) {
	const { user, username } = useContext(UserContext)
	const [show, setShow] = useState(false)
	const list = GetPics(auth.currentUser.uid)

	const copyImage = (elm) => {
		const source = elm.target.src
		navigator.clipboard.writeText(`![alt](${source})`)
		toast.success("copied to clipboard")
	}

	return (
		<>
			<aside className={styles.asideTools}>
				<h3>Tools</h3>
				<button onClick={() => setPreview(!preview)}>
					{preview ? "Edit" : "Preview"}
				</button>
				<Link href={`/${post.username}/${post.slug}`} passHref>
					<button className="btn-blue">Live view</button>
				</Link>
				<button className="btn btn-primary btn-red" onClick={handleShow}>
					Delete
				</button>
				<Button
					variant="success"
					id={styles.dropdownBasic}
					onClick={() => setShow(!show)}>
					Saved Pictures
				</Button>
			</aside>
			<Modal fullscreen={true} show={show} onHide={() => setShow(false)}>
				<Modal.Header closeButton>
					<Modal.Title>
						Click on an image to copy the code to paste in your post
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className={styles.imageList}>
					{list.map(({ link, index }) => {
						return (
							<div key={index} className={styles.imageCont}>
								<img
									src={link}
									key={index}
									alt="profile pic"
									className={styles.images}
									onClick={copyImage}
								/>
							</div>
						)
					})}
				</Modal.Body>
			</Modal>
		</>
	)
}
