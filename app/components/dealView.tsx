
import { useState, useEffect } from 'react'

import { DealRoomController, Deal, AssetStatus } from '../services/dealRoomController'
import { getMagicProvider, getUser } from '../services/userService'
import { Button, Table } from 'react-bootstrap'
import { MagicUserMetadata } from 'magic-sdk'
import { BigNumber, BigNumberish } from 'ethers/utils'
import { DEALROOM_HUB } from 'lib/settings'

export type DealViewProps = { 
    roomId: string;
    dealId: number;
}

const DealStatus = ["", "Open", "Cancelled", "Settled"];

export default function DealView(props: DealViewProps) {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    let deal: Deal
    let setDeal: Function
    [deal, setDeal] = useState(null)
    const [user, setUser] = useState<MagicUserMetadata>(null)
    const [buyer, setBuyer] = useState("")
    const [seller, setSeller] = useState("")
    const [iAmSeller, setIAmSeller] = useState(false)
    const [iAmBuyer, setIAmBuyer] = useState(false)
    const [roomId, setRoomId] = useState(props.roomId)
    const [dealId, setDealId] = useState(props.dealId)
    const [dealStatus, setDealStatus] = useState("")
    const [assetStatus, setAssetStatus] = useState<AssetStatus[]>([])
    const [missingAssets, setMissingAssets] = useState(-1)
    const [missingTokens, setMissingTokens] = useState(-1)
    const [myTokenBalance, setMyTokenBalance] = useState<BigNumberish>(0)
    const [myAssetBalance, setMyAssetBalance] = useState<BigNumberish>(0)
    const [dealRoomController, setDealRoomController] = useState<DealRoomController>(null)
    const [agentConfirmations, setAgentConfirmations] = useState(0)
    const [dealConfirmations, setDealConfirmations] = useState(0)

    useEffect(() => {
        setup()
    }, [props.dealId, props.roomId]);

    async function setup() {
        console.log(`setup(): ${props.dealId}, ${props.roomId}`)
        if (props.dealId == undefined || !props.roomId) {
            return
        }
        //Get data
        const provider = getMagicProvider()
        const _user = await getUser()       
        const _dealRoomController = new DealRoomController(DEALROOM_HUB, props.roomId, provider.getSigner()) 
        await _dealRoomController.init()      
        const _deal = await _dealRoomController.getDeal(props.dealId)
        const _buyer = await _dealRoomController.getBuyer()
        const _seller = await _dealRoomController.getSeller()
        const _myTokenBalance = await _dealRoomController.getMyTokenBalance(_deal.id)
        const _myAssetBalance = await _dealRoomController.getMyAssetBalance(_deal.id)
        const _assetStatus = await _dealRoomController.getDealAssetStatus(_deal.id)

        //Set state
        //Note: the state change is asynchronous
        setDealStatus(DealStatus[_deal?.status ?? 0])
        setRoomId(props.roomId)
        setDealId(props.dealId)
        setDealRoomController(_dealRoomController)

        setDeal(_deal)
        setUser(_user)
        setBuyer(_buyer)
        setSeller(_seller)
        setIAmSeller(_user.publicAddress === _seller)
        setIAmBuyer(_user.publicAddress === _buyer) 
        setMyTokenBalance((new BigNumber(_myTokenBalance)).toNumber())
        setMyAssetBalance((new BigNumber(_myAssetBalance)).toNumber())
        setMissingTokens(await _dealRoomController.getDealMissingTokens(_deal.id))  
        setMissingAssets(await _dealRoomController.getDealMissingAssets(_deal.id))
        setAssetStatus(_assetStatus)
        setAgentConfirmations((new BigNumber(_deal.agentConfirmations)).toNumber())
        setDealConfirmations((new BigNumber(_deal.dealConfirmations)).toNumber())
    }

    async function handleDepositTokens() {
        if (!dealRoomController) {
            return
        }
        await dealRoomController.depositDealTokens(deal.id, deal.price)
        //setMissingTokens(await dealRoomController.getDealMissingTokens(deal.id)) 
        await setup() 
    }

    async function handleDepositAssets() {
        if (!dealRoomController) {
            return
        }
        debugger
        await dealRoomController.depositDealAssets(deal.id, deal.assetItems)
        // setMissingAssets(await dealRoomController.getDealMissingAssets(deal.id))
        // setAssetStatus(await dealRoomController.getDealAssetStatus(dealId))
        await setup()
    }

    async function handleWithdrawTokens() {
        if (!dealRoomController) {
            return
        }
        await dealRoomController.withdrawDealTokens(deal.id)
        // setMissingTokens(await dealRoomController.getDealMissingTokens(deal.id))  
        await setup()
    }

    async function handleWithdrawAssets() {
        debugger
        if (!dealRoomController) {
            return
        }
        await dealRoomController.withdrawDealAssets(deal.id)
        // setMissingAssets(await dealRoomController.getDealMissingAssets(deal.id))
        await setup()
    }

    async function handleProposeAgentsApprove() {
        if (!dealRoomController) {
            return
        }
        try {
            setLoading(true)
            await dealRoomController.proposeAgentsSettleDeal(deal.id)
        } finally {
            setLoading(false)
        }
    }

    async function handleApproveAgentsApprove() {
        if (!dealRoomController) {
            return
        }
        try {
            setLoading(true)
            await dealRoomController.approveAgentSettlementProposal(deal.id)
        } finally {
            setLoading(false)
        }
    }

    async function handleProposeMainSettle() {
        if (!dealRoomController) {
            return
        }
        try {
            setLoading(true)
            await dealRoomController.proposeMainSettleDeal(deal.id)
        } finally {
            setLoading(false)
        }
    }

    async function handleApproveMainSettle() {
        if (!dealRoomController) {
            return
        }
        try {
            setLoading(true)
            await dealRoomController.approveDealSettlementProposal(deal.id)
        } finally {
            setLoading(false)
        }
    }

    const requestAgentsApproveButton = 
        <Button
            onClick={handleProposeAgentsApprove}
            variant="primary"
        >
            {loading ? 'Sending...' : 'Propose Agents Sign'}
        </Button>

    const approveAgentsApproveButton = (
        <Button
            onClick={handleApproveAgentsApprove}
            variant="primary"
        >
            {loading ? 'Sending...' : 'Approve Agents Sign'}
        </Button>
    )

    const requestSettleMainButton = (
        <Button
            onClick={handleProposeMainSettle}
            variant="primary"
        >
            {loading ? 'Sending...' : 'Propose Settlement'}
        </Button>
    )

    const approveSettleMainButton = (
        <Button
            onClick={handleApproveMainSettle}
            variant="primary"
        >
            {loading ? 'Sending...' : 'Approve Settlement'}
        </Button>
    )

    if (deal !== null) {
        return (
            <>
                <h3>Status: {dealStatus}</h3>
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
                            <th>Buyer {iAmBuyer?"(You)":""}</th>
                            <td>{buyer}</td>
                        </tr>
                        <tr>
                            <th>Seller {iAmSeller?"(You)":""}</th>
                            <td>{seller}</td>
                        </tr>  
                        <tr>
                            <th>Agent signatures</th>
                            <td>{new BigNumber(deal.agentConfirmations).toNumber()}/3</td>
                        </tr>  
                        <tr>
                            <th>Deal signatures</th>
                            <td>{new BigNumber(deal.dealConfirmations).toNumber()}/3</td>
                        </tr>
                    </tbody>
                    
                </Table>

                <h4>Tokens</h4>
                <Table bordered size="sm">
                    <tbody>
                        <tr>
                            <th>Your balance</th>
                            <td>{myTokenBalance}</td>
                        </tr>
                        <tr>
                            <th>Price in tokens</th>
                            <td>{deal.price.toNumber()}</td>
                        </tr>
                        <tr>
                            <th>Tokens deposited</th>
                            <td>{deal.price.toNumber()-missingTokens}</td>
                        </tr>
                        <tr>
                            <th>Tokens pending</th>
                            <td className={missingTokens?"important":"safe"}>{missingTokens}</td>
                        </tr>
                    </tbody>
                    
                </Table>

                <h4>Assets</h4>
                <Table bordered size="sm">
                    <tbody>
                    <tr>
                        <th>Your balance</th>
                            <td>{myAssetBalance}</td>
                        </tr>
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
                            <td className={missingAssets?"important":"safe"}>{missingAssets}</td>
                        </tr>
                        
                    </tbody>

                </Table>

                <Table bordered size="sm">
                    <thead>
                        <tr>
                            <th>Asset</th>
                            <th>Owner</th>
                            <th>Deposited</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assetStatus?.map(
                            item=>{
                                const deposited = item.owner === props.roomId
                                return (
                                    <tr>
                                        <td key={Number(item.assetId)}>{Number(item.assetId)}</td>
                                        <td className={deposited?"safe": "normal"}>{item.owner} </td>
                                        <td>{deposited?"Yes":"No"}</td>
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

                <Button
                    onClick={handleWithdrawTokens}
                    variant="primary"
                >
                    {loading ? 'Sending...' : 'Withdraw tokens'}
                </Button>

                <Button
                    onClick={handleWithdrawAssets}
                    variant="primary"
                >
                    {loading ? 'Sending...' : 'Withdraw assets'}
                </Button>

                {requestSettleMainButton}
                {approveSettleMainButton}

                {requestAgentsApproveButton}
                {approveAgentsApproveButton}
                {}

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



