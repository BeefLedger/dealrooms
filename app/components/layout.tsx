import Head from 'next/head'
import {
	Container,
	Row,
	Col
} from 'react-bootstrap'
//import Link from 'next/link'

export const siteTitle = 'Deal Room'

export default function Layout({
	children,
	home
}) {
	return (
		<div>
			<Head>
				<link rel="icon" href="/favicon.ico" />
				<meta
					name="description"
					content="Safely buy and sell"
				/>
				<meta
					property="og:image"
					content={`https://og-image.now.sh/${encodeURI(
						siteTitle
					)}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
				/>
				<meta name="og:title" content={siteTitle} />

			</Head>
			<Container>
				<Row>
					<Col>
						<header>
							<h1>{siteTitle}</h1>
						</header>
					</Col>
				</Row>
				<Row>
					<Col>
						<main>{children}</main>
					</Col>
				</Row>
			</Container>
		</div>
	)
}