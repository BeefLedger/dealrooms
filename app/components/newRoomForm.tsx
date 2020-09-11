import { Form, InputGroup, Button } from 'react-bootstrap'
import { useState } from 'react'

import { getUser, getMagicProvider } from '../services/userService'
import { DealRoomController } from '../services/dealService'
import * as DataStorage from '../services/storage'

export default function NewRoomForm() {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [buyer, setBuyer] = useState(null)
    const [seller, setSeller] = useState(null)
    const [arbitrator, setArbitrator] = useState(null)

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

            <Button
                    onClick={handleSubmit}
                    variant="primary"
            >
                    {loading ? 'Saving...' : 'Save'}
            </Button>
        </>
    )
}
