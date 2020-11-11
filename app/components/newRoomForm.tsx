import { Form, InputGroup, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react'

import { getUser, getMagicProvider } from '../services/userService'
import { DealRoomController } from '../services/dealRoomController'
import * as DataStorage from '../services/storage'
// import { demoEnvironment } from 'ethereum/demo/setup'
import { useRouter } from 'next/router'
import { MagicUserMetadata } from 'magic-sdk'
import { DEALROOM_HUB, DEFAULT_ACCOUNTS } from 'lib/settings'

const accounts = [
    {
        address: "0x0",
        name: "Select..."
    },
].concat(DEFAULT_ACCOUNTS)

const sensors = [
    {
        address: "0x205742d1d3C6249cb382bA2142eD197d436B326b",
        name: "LiveX Sensortone 2000"
    },
    {
        address: "0xAa4F52b0985f5Df9a2BF9Bcc3d33A72eeaf36b98",
        name: "HeatFeed 2.6"
    },
]

const docApprovers = [
    {
        address: "0x4A7D5F0463e1bCB535062AB8B76d0Ce7224A2841",
        name: "Approver 1"
    },
    {
        address: "0xEca31FcDb5377d9902B3274A0c48f0469375A013",
        name: "Approver 2"
    },
]


export default function NewRoomForm() {

    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [buyer, setBuyer] = useState("")
    const [seller, setSeller] = useState("")
    const [user, setUser] = useState<MagicUserMetadata>(null)
    const [arbitrator, setArbitrator] = useState("")
    const [docApprover, setDocApprover] = useState("")
    const [sensorApprover, setSensorApprover] = useState("")
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
            const signer = await provider.getSigner()
            const roomAddress = await DealRoomController.deployRoom({
                dealRoomHubAddress: DEALROOM_HUB,
                buyer,
                seller,
                arbitrator,
                docApprover,
                sensorApprover,
            },
            signer)
        
            const controller = new DealRoomController(roomAddress, signer)
            await controller.init();
            const dealRoomContract = await controller.getDealRoomContract();

            router.push(`/room/[room_id]`, `/room/${dealRoomContract.address}`)
        }
        catch (err) {
            setLoading(false)
            setError(`${err}`)
            console.error(err)
        }
        setLoading(false)
    };

    const selectOptions = accounts.map((item)=> {
        return <option key={item.address} value={item.address}>{item.name} {item.address===user?.publicAddress?"(You)":""}</option>
    })

    const sensorOptions = sensors.map((item)=> {
        return <option key={item.address} value={item.address}>{item.name}</option>
    })

    const docApproverOptions = docApprovers.map((item)=> {
        return <option key={item.address} value={item.address}>{item.name}</option>
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
                <Form.Control as="select" placeholder="Ethereum address" onChange={(e)=>setDocApprover(e.target.value)}>
                    {selectOptions}
                </Form.Control>
            </InputGroup>

            <Form.Label>Sensor Service</Form.Label>
            <InputGroup className="mb-2">
                <InputGroup.Prepend>
                    <InputGroup.Text>0x</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control as="select" placeholder="Ethereum address" onChange={(e)=>setSensorApprover(e.target.value)}>
                    {selectOptions}
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
