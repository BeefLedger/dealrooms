
import { useState, useEffect } from 'react'

import { DealRoomController, Deal, loadDealRoomController } from '../services/dealService'

export default function DealView(props) {
    console.log("*** Initial props:", JSON.stringify(props))

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    let deal: Deal
    let setDeal: Function
    [deal, setDeal] = useState(null)
    const [buyer, setBuyer] = useState("")
    const [seller, setSeller] = useState("")
    const [dealId, setDealId] = useState(props.dealId)
    useEffect(() => {
        load(dealId)
    }, [props.dealId]);

    async function load(dealId: number) {
        console.log(`*** load(${dealId})`)
        if (!dealId) {
            return
        }
        let dealRoomController: DealRoomController
        dealRoomController = loadDealRoomController()
        console.log(`loading deal ${dealId}`)
        const _deal = await dealRoomController.getDeal(dealId)
        console.log(JSON.stringify(_deal, undefined, 4))
        setDeal(_deal) 
        const b = await dealRoomController.getBuyer()
        console.log(`***buyer ${JSON.stringify(b, undefined, 4)}`)
        setBuyer(b)
        setSeller(await dealRoomController.getSeller())
    }

    if (deal) {
        return (
            <>
                <h2>Buyer (ERC-20 spender)</h2>
                <p>{buyer}</p>

                <h2>Seller (ERC-721 provider)</h2>
                <p>{seller}</p>

                <h2>Token Contract (ERC-20)</h2>
                <p>{deal?.erc20}</p>

                <h2>Asset Contract (ERC-20)</h2>
                <p>{deal?.erc721}</p>

                <h2>Tokens to be sold</h2>
                <ul>
                    {deal.assetItems.map(item=>{return <li key={item.toNumber()}>{item.toNumber()}</li>})}
                </ul>

                <h2>Price in tokens</h2>
                <p>{deal.price.toNumber()}</p>
            </>
        )
    } else {
        return ( 
            <>
                <p>Loading {props.dealId}...</p>
            </>
        )
    }

}



