import Head from 'next/head'
import Layout from '../components/layout'
import NewRoomForm from '../components/newRoomForm'

export default function NewDeal() {
    return (
        <Layout home>
            <Head>
                <title>Create New Deal Room</title>
            </Head>

            <h1>New Room</h1>
            <NewRoomForm></NewRoomForm>
            
        </Layout>
    )
}

