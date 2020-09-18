
import { useState, useEffect } from 'react'

import { DealRoomController, Deal } from '../services/dealService'
import { getMagicProvider, getUser } from '../services/userService'
import { Button } from 'react-bootstrap'
import { MagicUserMetadata } from 'magic-sdk'

export type DealViewProps = { 
    roomId: string;
    dealId: number;
}

export default function DealView(props: DealViewProps) {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    let deal: Deal
    let setDeal: Function
    [deal, setDeal] = useState(null)
    const [user, setUser] = useState<MagicUserMetadata>(null)
    const [buyer, setBuyer] = useState("")
    const [seller, setSeller] = useState("")
    const [roomId, setRoomId] = useState(props.roomId)
    const [dealId, setDealId] = useState(props.dealId)
    const [missingAssets, setMissingAssets] = useState(-1)
    const [missingTokens, setMissingTokens] = useState(-1)
    const [dealRoomController, setDealRoomController] = useState<DealRoomController>(null)
    useEffect(() => {
        setup()
    }, [props.dealId, props.roomId]);

    async function setup() {
        if (!props.dealId || !props.roomId) {
            return
        }
        setRoomId(props.roomId)
        setDealId(props.dealId)
        //let dealRoomController: DealRoomController
        const provider = getMagicProvider()
        await setUser(await getUser())
        const _dealRoomController = new DealRoomController(props.roomId, provider.getSigner())
        setDealRoomController(_dealRoomController)

        const _deal = await _dealRoomController.getDeal(props.dealId)
        await setDeal(_deal)

        setBuyer(await _dealRoomController.getBuyer())
        setSeller(await _dealRoomController.getSeller())
        setMissingAssets(await _dealRoomController.getDealMissingAssets(_deal.id))
        setMissingTokens(await _dealRoomController.getDealMissingTokens(_deal.id))  
    }

    async function handleDepositTokens() {
        if (!dealRoomController) {
            return
        }
        await dealRoomController.depositDealTokens(deal.id, deal.price)
        setMissingTokens(await dealRoomController.getDealMissingTokens(deal.id))  
    }

    async function handleDepositAssets() {
        if (!dealRoomController) {
            return
        }
        await dealRoomController.depositDealAssets(deal.id, deal.assetItems)
        setMissingAssets(await dealRoomController.getDealMissingAssets(deal.id))
    }

    if (deal !== null) {
        return (
            <>
                <h2>User</h2>
                <b>{user.publicAddress}</b>

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
                <Button
                    onClick={handleDepositAssets}
                    variant="primary"
                >
                    {loading ? 'Sending...' : 'Deposit assets'}
                </Button>
                
                <h3>Missing tokens: {missingTokens}</h3>
                <Button
                    onClick={handleDepositTokens}
                    variant="primary"
                >
                    {loading ? 'Sending...' : 'Deposit tokens'}
                </Button>

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



