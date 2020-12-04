import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import { Button } from 'react-bootstrap'
import Link from 'next/link'
import RoomList from 'components/roomList'

export default function Dashboard() {
    const router = useRouter()

    return (
        <Layout home>
            <section>
                <h3>Rooms</h3>
                <RoomList></RoomList>
            </section>
            <section>
                <Link href="/newRoom">
                    <Button variant="primary">
                        New Room...
                    </Button>
                </Link>
            </section>
        </Layout>
    )
}
