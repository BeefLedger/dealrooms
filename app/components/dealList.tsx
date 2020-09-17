
import { useState, useEffect } from 'react'
import Link from 'next/link'

import { DealRoomController, Deal } from '../services/dealService'
import { getMagicProvider } from '../services/userService'
import * as DataStorage from '../services/storage'

export default function DealView() {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [deals, setDeals] = useState([])

    useEffect(() => {
        load()
    }, []);

    async function load() {

        const provider = getMagicProvider()
        const dealRoomController = new DealRoomController(DataStorage.getItem("dealRoomAddress"), provider.getSigner())

        const _deals: Deal[] = await dealRoomController.getDeals()
        console.log(JSON.stringify(_deals, undefined, 4))
        setDeals(_deals)
    }

    return (

        <ul>
            {deals.map(
                (item) => {
                    //return <li key={item.id}>{item.id}</li>
                return <li key={item.id}><Link href="/deal/[id]" as={`/deal/${item.id}`}><a>Deal ID: {item.id} Price: B{item.price.toNumber()}</a></Link></li>
                }
            )}
        </ul>

    )  
}



