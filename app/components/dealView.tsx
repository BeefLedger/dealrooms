
import { useState, useEffect } from 'react'

import { DealRoomController, Deal } from '../services/dealService'
import { getMagicProvider, getUser } from '../services/userService'
import { Button, Table } from 'react-bootstrap'
import { MagicUserMetadata } from 'magic-sdk'
import DataCard from './dataCard'

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
                <Table bordered size="sm">
                    <tbody>
                        <tr>
                            <th>Token Contract (ERC-20)</th>
                            <td>{deal?.erc20}</td>
                        </tr>
                        <tr>
                            <th>Asset Contract (ERC-721)</th>
                            <td>{deal?.erc721}</td>
                        </tr>
                    </tbody>
                </Table>

                <Table bordered size="sm">
                    <tbody>
                        <tr>
                            <th>Buyer</th>
                            <td>{buyer}</td>
                        </tr>
                        <tr>
                            <th>Seller</th>
                            <td>{seller}</td>
                        </tr>    
                    </tbody>
                    
                </Table>

                <h4>Tokens</h4>
                <Table bordered size="sm">
                    <tbody>
                        <tr>
                            <th>Price in tokens</th>
                            <td>{deal.price.toNumber()}</td>
                        </tr>
                        <tr>
                            <th>Tokens deposited</th>
                            <td>{deal.price.toNumber()-missingAssets}</td>
                        </tr>
                        <tr>
                            <th>Tokens pending</th>
                            <td className="important">{missingAssets}</td>
                        </tr>
                    </tbody>
                    
                </Table>

                <h4>Assets</h4>
                <Table bordered size="sm">
                    <tbody>
                        <tr>
                            <th>Assets for sale</th>
                            <td>{deal.assetItems.length}</td>
                        </tr>
                        <tr>
                            <th>Assets deposited</th>
                            <td>{deal.assetItems.length-missingAssets}</td>
                        </tr>
                        <tr>
                            <th>Assets pending</th>
                            <td className="important">{missingAssets}</td>
                        </tr>
                    </tbody>

                </Table>

                <Table bordered size="sm">
                    <thead>
                        <tr>
                            <th>Asset</th>
                            <th>Description</th>
                            <th>Deposited</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deal.assetItems.map(
                            item=>{
                                return (
                                    <tr>
                                        <td key={Number(item)}>{item}</td>
                                        <td>Information</td>
                                        <td>...</td>
                                    </tr>
                                )
                            }
                        )}
                    </tbody>
                </Table>

                <Button
                    onClick={handleDepositAssets}
                    variant="primary"
                >
                    {loading ? 'Sending...' : 'Deposit assets'}
                </Button>
                
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



