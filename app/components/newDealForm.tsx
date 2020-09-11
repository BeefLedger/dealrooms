import { Form, InputGroup, Button } from 'react-bootstrap'
import { useState } from 'react'

import { getUser, getMagicProvider } from '../services/userService'
import { DealRoomController, Deal } from '../services/dealService'
import * as DataStorage from '../services/storage'

export default function NewDealForm() {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [erc20, setErc20] = useState(null)
    const [erc721, setErc721] = useState(null)
    const [price, setPrice] = useState(null)
    const [assets, setAssets] = useState(null)

    

    //const history = useHistory();

    async function handleSubmit (e)  {
        try {
            e.preventDefault()
            setLoading(true)
            const user = await getUser()
            if (!user) {
                throw Error('Not signed in')
            }
            const provider = getMagicProvider()
            const dealRoom = DataStorage.getItem('dealRoomAddress')
            const controller = new DealRoomController(dealRoom, provider.getSigner())

            const assetItems = assets.split("\n")
            
            const deal: Deal = {
                erc20,
                erc721,
                price,
                assetItems
            }
            const updatedDeal = await controller.makeDeal(deal)
            console.log(JSON.stringify(updatedDeal, undefined, 4))  
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
            <ul>
                <li>ERC-20 0x55A002AA3a6eC7ecC9dEc14e9D66dc8DA350817e</li>
                <li>ERC-721 0x6b74B686Af6fDFD65e3AE0135042b4698ABB6CE7</li>           
            </ul>

            <h3>Arbitrator</h3>
            <p>TODO</p>


            <h3>Buyer (ERC-20 spender)</h3>
            <p>TODO</p>

            <h3>Seller (ERC-721 provider)</h3>
            <p>TODO</p>

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
