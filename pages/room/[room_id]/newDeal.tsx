import Head from 'next/head'
import { useRouter } from 'next/router'
import Layout from '../../../components/layout'
import NewDealForm from "../../../components/newDealForm"

export default function NewDeal() {
    const router = useRouter()

    return (
        <Layout home>
            <Head>
                <title>Create New Deal</title>
            </Head>

            <h3>New Deal</h3>
            <h5>Room {router.query.room_id as string}</h5>
            <NewDealForm roomId={router.query.room_id as string}></NewDealForm>
            
        </Layout>
    )
}

