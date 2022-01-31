import Image from "next/image"
import { useContext, useEffect, useState, useCallback } from "react"
import { UserContext } from "../lib/context"
import Metatags from "../components/Metatags"

import debounce from "lodash.debounce"

import { auth, googleAuth, signInRedirect, firestore } from "../lib/firebase"
import { doc, getDoc, writeBatch } from "firebase/firestore"
import { signOut } from "firebase/auth"

import googleLogo from "../images/google.png"

export default function EnterPage() {
	const { user, username } = useContext(UserContext)

	return (
		<main>
			<Metatags />
			{user ? (
				!username ? (
					<>
						<UsernameForm />
					</>
				) : (
					<SignOutButton />
				)
			) : (
				<SignInButton />
			)}
		</main>
	)
}

function SignInButton() {
	const signInWithGoogle = async () => {
		try {
			await signInRedirect(auth, googleAuth)
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<button className="btn-google" onClick={signInWithGoogle}>
			<Image src={googleLogo} width={32} height={32} alt="google" />
			Sign In With Google
		</button>
	)
}

function SignOutButton() {
	return <button onClick={() => signOut(auth)}>Sign Out</button>
}

function UsernameMessage({ username, isValid, loading }) {
	if (loading) {
		return <p>Checking...</p>
	} else if (isValid) {
		return <p className="text-success">{username} is available</p>
	} else if (username && !isValid) {
		return <p className="text-danger">{username} is taken</p>
	} else {
		return <p></p>
	}
}

function UsernameForm() {
	const [formValue, setFormValue] = useState("")
	const [isValid, setIsValid] = useState(false)
	const [loading, setLoading] = useState(false)

	const { user, username } = useContext(UserContext)

	const onSubmit = async (params) => {
		params.preventDefault()

		const userDoc = doc(firestore, "users", user.uid)
		const usernameDoc = doc(firestore, "usernames", formValue)

		const batch = writeBatch(firestore)

		try {
			batch.set(userDoc, {
				username: formValue,
				photoURL: user.photoURL,
				disiplayName: user.displayName
			})
			batch.set(usernameDoc, { uid: user.uid })

			await batch.commit()
		} catch (error) {
			console.error(error)
		}
	}

	const onChange = (elm) => {
		const value = elm.target.value.toLowerCase()
		const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/

		if (value.length < 3) {
			setFormValue(value)
			setLoading(false)
			setIsValid(false)
		}

		if (re.test(value)) {
			setFormValue(value)
			setIsValid(true)
			setLoading(true)
		}
	}

	useEffect(() => {
		checkUsername(formValue)
	}, [checkUsername, formValue])

	const checkUsername = useCallback(
		debounce(async (username) => {
			if (username.length >= 3) {
				const ref = doc(firestore, "usernames", username)

				const check = await getDoc(ref)
				const exists = check.exists()

				setIsValid(!exists)
				setLoading(false)
			}
		}, 500),
		[getDoc, setIsValid, setLoading, firestore]
	)

	return (
		!username && (
			<section>
				<h3>Choose Username</h3>
				<form onSubmit={onSubmit}>
					<input
						type="text"
						name="username"
						placeholder="username"
						value={formValue}
						onChange={onChange}
					/>
					<UsernameMessage
						username={username}
						isValid={isValid}
						loading={loading}
					/>
					<button type="submit" disabled={!isValid}>
						Choose
					</button>
				</form>
			</section>
		)
	)
}
