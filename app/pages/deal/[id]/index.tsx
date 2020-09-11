import { useRouter } from 'next/router'
import Layout from '../../../components/layout'
import DealView from '../../../components/dealView'

const Post = () => {
    const router = useRouter()

    return (
        <Layout home>

            <section>
                <h1>Deal {router.query.id}</h1>
                <DealView dealId={router.query.id}>
                </DealView>
            </section>
        </Layout>

    )
}

export default Post