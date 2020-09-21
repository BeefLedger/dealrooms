import { Form, InputGroup, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react'

import { getUser, getMagicProvider } from '../services/userService'
import { DealRoomController } from '../services/dealService'
import * as DataStorage from '../services/storage'
// import { demoEnvironment } from 'ethereum/demo/setup'
import { useRouter } from 'next/router'
import { MagicUserMetadata } from 'magic-sdk'

const accounts = [
    {
        address: "0x0",
        name: "Select..."
    },
    {
        address: "0xB051764B2da6Aa16b9Bc439BcAd1c309Ad7a32CA",
        name: "Alice Angstrom"
    },
    {
        address: "0x89CFC4E15C4b2fAb2b3029eae40B137B91C2129e",
        name: "Bruce Bullock"
    },
    {
        address: "0xe2724151E5C905A82aF7AB4476748655E22d72D6",
        name: "Charlie Crank"
    },
    {
        address: "0x0Ad0a7Aa5395B09435b7cd42Eb254a163a4a5cf9",
        name: "Daniel Dumphrey"
    },
    {
        address: "0xAd6ed15133884D83d3A6b93006fd34a13d9E5A7E",
        name: "Eric Ellison"
    },
    {
        address: "0x205742d1d3C6249cb382bA2142eD197d436B326b",
        name: "Frances Finch"
    },
    {
        address: "0xAa4F52b0985f5Df9a2BF9Bcc3d33A72eeaf36b98",
        name: "Grant Gallant"
    },
    {
        address: "0x4A7D5F0463e1bCB535062AB8B76d0Ce7224A2841",
        name: "Herman Hurst"
    },
    {
        address: "0xEca31FcDb5377d9902B3274A0c48f0469375A013",
        name: "Ian Illingsworth"
    },
    
    {
        address: "0x3c8f64283Da1846252b201bb4ab198cDFeFAAE3c",
        name: "Big Bazza's Bargain Burgers"
    },
    {
        address: "0xd5AE65265C8F8E09C48da86DE16287F5d90c75e5",
        name: "Earsman Farming Solutions"
    },
]


export default function NewRoomForm() {

    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [buyer, setBuyer] = useState(null)
    const [seller, setSeller] = useState(null)
    const [user, setUser] = useState<MagicUserMetadata>(null)
    const [arbitrator, setArbitrator] = useState(null)
    const [roomId, setRoomId] = useState("")

    useEffect(() => {
        load()
    }, []);

    async function load() {
        setUser(await getUser())
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
            const controller = new DealRoomController(
                {
                    buyer,
                    seller,
                    arbitrator
                },
                provider.getSigner()
            )
            //TODO: Make an explicit deploy() method
            const contract = await controller.getDealRoomContract()

            router.push(`/room/[room_id]`, `/room/${contract.address}`)

            DataStorage.push("rooms", contract.address) //setItem("dealRoomAddress", contract.address)
            //console.log(`Contract ${contract.address}`)
        }
        catch (err) {
            setLoading(false)
            setError(`${err}`)
            console.error(err)
        }
        setLoading(false)
    };

    const selectOptions = accounts.map((item)=> {
        return <option value={item.address}>{item.name} {item.address===user?.publicAddress?"(You)":""}</option>
    })

    return (
        <>
            <h3>Welcome, {user?.email || "stranger"}</h3>
            <h5>{user?.publicAddress || ""}</h5>

            <Form.Label>Seller</Form.Label>
            <InputGroup className="mb-2">
                <InputGroup.Prepend>
                    <InputGroup.Text>0x</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control as="select" placeholder="Ethereum address" onChange={(e)=>setSeller(e.target.value)}>
                    {selectOptions}
                </Form.Control>
            </InputGroup>

            <Form.Label>Arbitrator</Form.Label>
            <InputGroup className="mb-2">
                <InputGroup.Prepend>
                    <InputGroup.Text>0x</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control as="select" placeholder="Ethereum address" onChange={(e)=>setArbitrator(e.target.value)}>
                    {selectOptions}
                </Form.Control>
            </InputGroup>

            <Form.Label>Buyer (ERC-20 spender)</Form.Label>
            <InputGroup className="mb-2">
                <InputGroup.Prepend>
                    <InputGroup.Text>0x</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control as="select" placeholder="Ethereum address" onChange={(e)=>setBuyer(e.target.value)}>
                    {selectOptions}
                </Form.Control>
            </InputGroup>

            <Form.Label>Document Approver</Form.Label>
            <InputGroup className="mb-2">
                <InputGroup.Prepend>
                    <InputGroup.Text>0x</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control as="select" placeholder="Ethereum address">
                    <option key={0} value={0}>None</option>
                    <option key={1} value={1}>Approval Committee A</option>
                    <option key={2} value={2}>Approval Committee B</option>                
                </Form.Control>
            </InputGroup>

            <Form.Label>Sensor Service</Form.Label>
            <InputGroup className="mb-2">
                <InputGroup.Prepend>
                    <InputGroup.Text>0x</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control as="select" placeholder="Ethereum address">
                    <option key={0} value={0}>None</option>
                    <option key={1} value={1}>LiveX Sensortone 2000</option> 
                    <option key={2} value={2}>HeatFeed 2.6</option>
                    
                </Form.Control>
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
