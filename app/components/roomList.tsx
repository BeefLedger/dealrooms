
import { useState, useEffect } from 'react'
import Link from 'next/link'

import { DealRoomController, Deal } from '../services/dealService'
import { getMagicProvider } from '../services/userService'
import * as Storage from '../services/storage'

export type RoomListProps = {
    roomId: string
}

export default function RoomList() {
    const [rooms, setRooms] = useState<string[]>([])

    useEffect(() => {
        load()
    }, []);

    async function load() {
        setRooms(Storage.getJson("rooms") as string[] || [])
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



