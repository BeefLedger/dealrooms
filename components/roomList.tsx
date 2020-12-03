
import { useState, useEffect } from 'react'
import Link from 'next/link'

import * as Storage from '../services/storage'
import { DealRoomController } from 'services/dealRoomController'
import { getMagicProvider } from 'services/userService'
import { DEALROOM_HUB } from 'lib/settings'

export type RoomListProps = {
    roomId: string
}

export default function RoomList() {
    const [rooms, setRooms] = useState<string[]>([])


    useEffect(() => {
        load()
    }, []);

    async function load() {
        const magic = await getMagicProvider()
        const signer = magic.getSigner()
        const rooms = await DealRoomController.getRooms(DEALROOM_HUB, signer)
        setRooms(rooms)
    }
    if (rooms && rooms.length) {
        return (
            <ul>
                {rooms.map(
                    (item) => {
                        return <li key={item}><Link href="/room/[roomId]" as={`/room/${item}`}><a>{item}</a></Link></li>
                    }
                )}
            </ul>
        )  
    } else {
        return <p>
            You haven't set up any rooms yet.
        </p>
    }


}



