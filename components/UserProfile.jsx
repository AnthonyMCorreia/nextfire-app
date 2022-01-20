import Image from "next/image"
import styles from "../styles/UserProfile.module.css"

export default function UserProfile({ user }) {
	return (
		<div className={styles.boxCenter}>
			<Image
				src={user.photoURL}
				alt={user.displayName}
				layout="fixed"
				width={100}
				height={100}
				className="card-img-center"
			/>
			<p>
				<i>@{user.username}</i>
			</p>
			<h1>{user.displayName}</h1>
		</div>
	)
}
