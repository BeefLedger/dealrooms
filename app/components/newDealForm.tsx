import { Form, InputGroup, Button } from 'react-bootstrap'
import { useState } from 'react'
import * as ethers from 'ethers'
import { bigNumberify } from 'ethers/utils'

import { getUser, getMagicLink, getMagicProvider } from '../services/userService'
import { DealRoomController, DealRoomCreateParams, Deal } from '../services/dealService'
import * as DataStorage from '../services/storage'

import { randomInt } from '../lib/random'

export default function NewDealForm() {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [buyer, setBuyer] = useState(null)
    const [seller, setSeller] = useState(null)
    const [arbitrator, setArbitrator] = useState(null)
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
            const controller = new DealRoomController(
                {
                    buyer,
                    seller,
                    arbitrator
                },
                provider.getSigner()
            )
            const contract = await controller.getDealRoomContract()
            DataStorage.setItem("dealRoomAddress", contract.address)
            console.log(`Contract ${contract.address}`)
            const assetItems = assets.value.split("\n")
            
            const deal: Deal = {
                id: bigNumberify(randomInt(1000)),
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
                <li>Arb 0xB051764B2da6Aa16b9Bc439BcAd1c309Ad7a32CA</li>
                <li>Buyer 0xc4e0daB85A5e7Cffec5025cb206E16278Ec20040</li>
                <li>Seller 0xd5AE65265C8F8E09C48da86DE16287F5d90c75e5</li>
                <li>ERC-20 0x0C3cC7b64D2513e7D85EbA96B2ad28196B29d078</li>
                <li>ERC-721 0xa768D41A0b7821bbe0311bb700f401EDb9b8F390</li>               
            </ul>

            <Form.Label>Arbitrator</Form.Label>
            <InputGroup className="mb-2">
                <InputGroup.Prepend>
                    <InputGroup.Text>0x</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control type="text" placeholder="Ethereum address" onChange={(e)=>setArbitrator(e.target.value)} />
            </InputGroup>

            <Form.Label>Buyer (ERC-20 spender)</Form.Label>
            <InputGroup className="mb-2">
                <InputGroup.Prepend>
                    <InputGroup.Text>0x</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control type="text" placeholder="Ethereum address" onChange={(e)=>setBuyer(e.target.value)} />
            </InputGroup>

            <Form.Label>Seller (ERC-721 provider)</Form.Label>
            <InputGroup className="mb-2">
                <InputGroup.Prepend>
                    <InputGroup.Text>0x</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control type="text" placeholder="Ethereum address" onChange={(e)=>setSeller(e.target.value)} />
            </InputGroup>

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
