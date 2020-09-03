import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedPostsData } from '../lib/posts'
import { GetStaticProps } from 'next'

export default function Home({ allPostsData }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>Deal Room</p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>

        <div className={utilStyles.contentItem}>
          {allPostsData.map(({ title, content}) => (
            <div>
              <h3>{title}</h3>
              <p>
                {content}
              </p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const allPostsData = getSortedPostsData()
  return {
    props: {
      allPostsData
    }
  }
}
