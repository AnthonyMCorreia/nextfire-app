import Link from "next/link"
import { useContext } from "react"
import { UserContext } from "../lib/context"

import { Card, Button } from "react-bootstrap"

export default function AuthCheck(props) {
	const { username } = useContext(UserContext)

	return username
		? props.children
		: // : props.fallback || <Link href="/enter">You must be signed in</Link>
		  props.fallback || <CardPopup />
}

function CardPopup() {
	return (
		<Card style={{ width: "22rem" }}>
			<Card.Header className="text-center">
				You must be signed in to see this
			</Card.Header>
			<Link href="/enter" passHref>
				<Button size="sm">Sign In</Button>
			</Link>
		</Card>
	)
}
