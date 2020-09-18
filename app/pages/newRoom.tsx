import Head from 'next/head'
import Layout from '../components/layout'
import NewRoomForm from '../components/newRoomForm'

export default function NewDeal() {
    return (
        <Layout home>
            <Head>
                <title>Create New Deal Room</title>
            </Head>

            <h3>New Room</h3>
            <NewRoomForm></NewRoomForm>
            
        </Layout>
    )
}

