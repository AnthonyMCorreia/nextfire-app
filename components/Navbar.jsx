import styles from "../styles/Navbar.module.css"

import Link from "next/link"
import Image from "next/image"
import { useContext } from "react"
import { UserContext } from "../lib/context"

export default function Navbar(props) {
	const { user, username } = useContext(UserContext)

	return (
		<nav className="navbar">
			<ul>
				<li>
					<Link href="/" passHref>
						<button className="btn-logo">FEED</button>
					</Link>
				</li>
				{username && user && (
					<div className={styles.navContent}>
						<li>
							<Link href="/admin" passHref>
								<button className="btn-blue">Your Posts</button>
							</Link>
						</li>
						<li>
							{user.photoURL ? (
								<Link href={`/${username}`} passHref>
									<Image
										src={user?.photoURL}
										width={45}
										height={45}
										alt="Profile Picture"
									/>
								</Link>
							) : null}
						</li>
					</div>
				)}

				{!username && (
					<li>
						<Link href="/enter" passHref>
							<button className="btn-blue">Log In</button>
						</Link>
					</li>
				)}
			</ul>
		</nav>
	)
}
