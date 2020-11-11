
import { useState, useEffect } from 'react'
import Link from 'next/link'

import { DealRoomController, Deal } from '../services/dealRoomController'
import { getMagicProvider } from '../services/userService'
import { DEALROOM_HUB } from 'lib/settings'

export type DealListProps = {
    roomId: string
}

export default function DealList(props: DealListProps) {
    console.log("DealList props:", JSON.stringify(props, undefined, 4))
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [roomId, setRoomId] = useState(props.roomId)
    const [deals, setDeals] = useState([])

    useEffect(() => {
        load()
    }, [props.roomId]);

    async function load() {
        if (!roomId) {
            return
        }
        console.log("load(): DealList props:", JSON.stringify(props, undefined, 4))
        const provider = getMagicProvider()
        //console.log(`const dealRoomController = new DealRoomController(${roomId}, provider.getSigner())`)
        const dealRoomController = new DealRoomController(roomId, provider.getSigner())
        await dealRoomController.init()

        const _deals: Deal[] = await dealRoomController.getDeals()
        console.log("Loaded deal room", JSON.stringify(_deals, undefined, 4))
        setDeals(_deals)
    }

    return (
        <ul>
            {deals.map(
                (item) => {
                    return <li key={item.id}><Link href="/room/[roomId]/[dealId]" as={`/room/${roomId}/${item.id}`}><a>Deal ID: {item.id} Price: B{item.price.toNumber()}</a></Link></li>
                }
            )}
        </ul>
    )  
}



