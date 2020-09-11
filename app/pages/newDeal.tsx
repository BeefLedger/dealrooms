import Head from 'next/head'
import Layout from '../components/layout'
import NewDealForm from "../components/newDealForm"

export default function NewDeal() {
    return (
        <Layout home>
            <Head>
                <title>Create New Deal Contract</title>
            </Head>

            <h1>New Deal</h1>
            <NewDealForm></NewDealForm>
            
        </Layout>
    )
}

