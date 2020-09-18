import { useRouter } from 'next/router'
import Layout from '../../../../components/layout'
import DealView from '../../../../components/dealView'
import { useEffect, useState } from 'react'

const Post = () => {
    const router = useRouter()

    let [dealId, setDealId] = useState(null)
    let [roomId, setRoomId] = useState(null)

    useEffect(() => {
        loadContent()
    }, [router.query]);

    async function loadContent() {
        if (router && router.query && router.query.room_id && router.query.deal_id) {
            setDealId(Number(router.query.deal_id))
            setRoomId(router.query.room_id)
        }
    }

    return (
        <Layout home>
            <section>
                <h3>Room {roomId}</h3>
                <h5>Deal {dealId}</h5>
                <DealView roomId={roomId} dealId={dealId}></DealView>
            </section>
        </Layout>
    )
}

export default Post