
import { useState, useEffect } from 'react'

import { DealRoomController, Deal } from '../services/dealService'
import { DealRoom } from '../ethereum/types/DealRoom'
import { getItem } from '../services/storage'
import { getSigner } from '../services/chain/signerFactory'
import { getMagicProvider } from '../services/userService'

export default function DealView(props) {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    let deal: Deal
    let setDeal: Function
    [deal, setDeal] = useState(null)
    const [buyer, setBuyer] = useState("")
    const [seller, setSeller] = useState("")
    const [dealId, setDealId] = useState(props.dealId)
    const [missingAssets, setMissingAssets] = useState(-1)
    const [missingTokens, setMissingTokens] = useState(-1)
    useEffect(() => {
        load(dealId)
    }, [props.dealId]);

    async function load(dealId: number) {
        console.log(`*** load(${dealId})`)
        if (!dealId) {
            return
        }
        let dealRoomController: DealRoomController
        const provider = getMagicProvider()
        dealRoomController = new DealRoomController(getItem("dealRoomAddress"), provider.getSigner() )
        const _deal = await dealRoomController.getDeal(dealId)
        console.log(JSON.stringify(_deal, undefined, 4))
        setDeal(_deal) 
        setBuyer(await dealRoomController.getBuyer())
        setSeller(await dealRoomController.getSeller())
        setMissingAssets(await dealRoomController.getDealMissingAssets(_deal.id))
        setMissingTokens(await dealRoomController.getDealMissingTokens(_deal.id))
    }

    if (deal !== null) {
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

                <h2>Assets to be sold</h2>
                <ul>
                    {deal.assetItems.map(item=>{return <li key={Number(item)}>{item}</li>})}
                </ul>

                <h2>Price in tokens</h2>
                <p>{deal.price.toNumber()}</p>
                <h3>Missing assets: {missingAssets}</h3>
                <h3>Missing tokens: {missingTokens}</h3>

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



