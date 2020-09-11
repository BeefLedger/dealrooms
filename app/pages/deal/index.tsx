import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import DealList from '../../components/dealList'

const Post = () => {
    const router = useRouter()

    return (
        <Layout home>

            <section>
                <h1>My Deals</h1>
                <DealList></DealList>
            </section>
        </Layout>

    )
}

export default Post