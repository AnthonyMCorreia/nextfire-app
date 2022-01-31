import Head from "next/head"

export default function Page({
	description = "nexfire, a clone of sites like medium or dev.to",
	image = "https://static.parade.com/wp-content/uploads/2021/04/funny-photo-e1617571145777.jpg",
	title = "nextfire"
}) {
	return (
		<Head>
			<title>{title}</title>
			<link rel="icon" href={image} />
			<meta name="description" content={description} />

			<meta name="twitter:card" content="summary" />
			<meta name="twitter:site" content="@nextfire" />
			<meta meta="twitter:title" content={title} />
			<meta name="twitter:desciprtion" content={description} />
			<meta name="twitter:image" content={image} />

			<meta property="og:title" content={title} />
			<meta property="og:desciprtion" content={description} />
			<meta property="og:image" content={image} />
		</Head>
	)
}
