import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
// import utilStyles from '../styles/utils.module.css'
import Authenticate from '../components/login'

export default function Home({ allPostsData }) {
	return (
		<Layout home>
			<Head>
				<title>{siteTitle}</title>
			</Head>
			<section>
				<Authenticate></Authenticate>
			</section>
		</Layout>
	)
}