import { useRouter } from 'next/router'
import Layout from '../../../components/layout'
import DealList from '../../../components/dealList'
import { Button, Card } from 'react-bootstrap'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { getMagicProvider } from 'services/userService'
import { DealRoomController } from 'services/dealService'

const RoomPage = () => {
    const router = useRouter()

    const [buyer, setBuyer] = useState("")
    const [seller, setSeller] = useState("")
    const [arb, setArb] = useState("")
    const [roomId, setRoomId] = useState("")

    useEffect(() => {
        loadContent()
    }, [router.query]);

    async function loadContent() {
        if (router && router.query && router.query.room_id) {
            console.log(router.query)
            setRoomId(router.query.room_id as string)
            const provider = getMagicProvider()
            const _dealRoomController = new DealRoomController(router.query.room_id as string, provider.getSigner())
            setBuyer(await _dealRoomController.getBuyer())
            setSeller(await _dealRoomController.getSeller())
        }

        //setArb(await _dealRoomController.getArbitrator())
    }

    if (roomId) {
        return (
            <Layout home>
                <h3>Room {router.query.room_id}</h3>
                <section>
                    <Card
                        bg={"Light"}
                        key={1}
                        text={'dark'}
                        style={{ }}
                        className="mb-2">
                        <Card.Header>Seller</Card.Header>
                        <Card.Body>
                            <Card.Text>{seller}</Card.Text>
                        </Card.Body>
                    </Card>

                    <Card
                        bg={"Light"}
                        key={2}
                        text={'dark'}
                        style={{ }}
                        className="mb-2">
                        <Card.Header>Buyer</Card.Header>
                        <Card.Body>
                            <Card.Text>{buyer}</Card.Text>
                        </Card.Body>
                    </Card>

                </section>
                <section>
                    <DealList roomId={roomId}></DealList>
                </section>
                <section>
                    <Link href="/room/[roomId]/newDeal" as={`/room/${router.query.room_id}/newDeal`}>
                        <Button variant="primary">
                            New Deal...
                        </Button>
                    </Link>
                </section>
            </Layout>
        )} else {
            return (<>
                Loading...
            </>)
        }
}

export default RoomPage
