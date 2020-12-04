import { useRouter } from 'next/router'
import DealView from '../../../../components/dealView'
import { useEffect, useState } from 'react'
import {
	Container,
	Row,
	Col
} from 'react-bootstrap'

const Deal = () => {
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
        <Container>
            <Row className="header">
                <Col>
                    <header>Deal {dealId}</header>
                </Col>
            </Row>
            <Row>
                <Col>
                    <DealView roomId={roomId} dealId={dealId}></DealView>
                </Col>
            </Row>
        </Container>
    )
}

export default Deal