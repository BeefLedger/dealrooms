import { Form, InputGroup, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import { getUser, getMagicProvider } from '../services/userService'
import { DealRoomController, Deal } from '../services/dealService'
import * as DataStorage from '../services/storage'

export type NewDealProps = {
    roomId: string;
}

const NewDealForm = (props: NewDealProps) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [erc20, setErc20] = useState(null)
    const [erc721, setErc721] = useState(null)
    const [price, setPrice] = useState(null)
    const [assets, setAssets] = useState(null)
    const [buyer, setBuyer] = useState("")
    const [seller, setSeller] = useState("")
    const [roomId, setRoomId] = useState(props.roomId)
    
    useEffect(() => {
        load()
    }, [props.roomId]);

    //const history = useHistory();


    async function load() {

        console.log('newDealForm: load()')
        if (!props.roomId) {
            return
        }
        console.log('newDealForm: loading')

        let dealRoomController: DealRoomController
        const provider = getMagicProvider()
        dealRoomController = new DealRoomController(props.roomId, provider.getSigner() )
        setBuyer(await dealRoomController.getBuyer())
        setSeller(await dealRoomController.getSeller())
    }

    async function handleSubmit (e)  {
        try {
            
            e.preventDefault()
            setLoading(true)
            const user = await getUser()
            if (!user) {
                throw Error('Not signed in')
            }
            const provider = getMagicProvider()

            const controller = new DealRoomController(props.roomId, provider.getSigner())

            const assetItems = assets.split("\n")
            
            const deal: Deal = {
                erc20,
                erc721,
                price,
                assetItems
            }
            const updatedDeal = await controller.makeDeal(deal)
            console.log(JSON.stringify(updatedDeal, undefined, 4))  
            router.push("/room/[room_id]/[deal_id]", `/room/${roomId}/${updatedDeal.id}`)
        }
        catch (err) {
            setLoading(false)
            setError(`${err}`)
            console.error(err)
        }
        setLoading(false)
    };

    return (
        <>
            <h3>Arbitrator</h3>
            <p>TODO: Load from multisig</p>

            <h3>Buyer (ERC-20 spender)</h3>
            <p>{buyer}</p>

            <h3>Seller (ERC-721 provider)</h3>
            <p>{seller}</p>

            <Form.Label>Token contract (ERC-20)</Form.Label>
            <InputGroup className="mb-2">
                <InputGroup.Prepend>
                    <InputGroup.Text>0x</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control type="text" placeholder="Ethereum address" onChange={(e)=>setErc20(e.target.value)} />
            </InputGroup>

            <Form.Label>Asset contract (ERC-721)</Form.Label>
            <InputGroup className="mb-2">
                <InputGroup.Prepend>
                    <InputGroup.Text>0x</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control type="text" placeholder="Ethereum address" onChange={(e)=>setErc721(e.target.value)} />
            </InputGroup>

            <Form.Label>Asset identifiers</Form.Label>
            <Form.Control as="textarea" rows={6} onChange={(e)=>setAssets(e.target.value)} />

            <Form.Label>Price in tokens</Form.Label>
            <Form.Control type="text" onChange={(e)=>setPrice(e.target.value)} />
            <Button
                    onClick={handleSubmit}
                    variant="primary"
            >
                    {loading ? 'Saving...' : 'Save'}
            </Button>
        </>
    )
}
export default NewDealForm
