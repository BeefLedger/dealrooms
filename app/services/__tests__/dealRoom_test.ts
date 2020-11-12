
import { JsonRpcProvider } from "ethers/providers"

import { ADMIN, TESTRPC_ACCOUNTS } from "../../lib/settings"
import { getProvider } from "../../services/chain/providerFactory"
import { Deal, DealRoomController } from "../../services/dealRoomController"
import { DealRoomCreateParams } from "../../ethereum/deploy/deploy"
import { DemoEnvironment, setupDemo } from "../../lib/demo/setup"
import { BigNumber } from "ethers/utils"

let dealRoomController: DealRoomController
let demoEnvironment: DemoEnvironment
let dealRoomHubAddress: string
let provider: JsonRpcProvider

const ROOM_1 = {
    buyer: TESTRPC_ACCOUNTS[5].address,
    seller: TESTRPC_ACCOUNTS[6].address,
    arbitrator: TESTRPC_ACCOUNTS[0].address,
    docApprover: TESTRPC_ACCOUNTS[3].address,
    sensorApprover: TESTRPC_ACCOUNTS[2].address,
}

let deal1: Deal

let roomAddress: string

jest.setTimeout(3 * 60 * 1000)

describe("Deploy dealroom", () => {
    beforeAll(async ()=> {
        //Deploy ERC20 and ERC720, mint some and assign them
        provider = await getProvider()
        demoEnvironment = await setupDemo(TESTRPC_ACCOUNTS)
        dealRoomHubAddress = demoEnvironment.deployedEnvironment.DealRoomHub.address
        expect(dealRoomHubAddress).toBeDefined()
        expect(demoEnvironment).toBeDefined()
        expect(demoEnvironment.deployedEnvironment).toBeDefined()
        expect(demoEnvironment.deployedEnvironment.DealRoomHub).toBeDefined()
    })

    it("Makes a room", async () => {
        const dealRoomCreateParams: DealRoomCreateParams = {
            dealRoomHubAddress,
            ...ROOM_1
        }
        roomAddress = await DealRoomController.deployRoom(dealRoomCreateParams, provider.getSigner(ADMIN))
        expect(roomAddress).toBeDefined()
        expect(roomAddress.length).toEqual(42)
    })

    it("Makes a deal", async () => {
        dealRoomController = new DealRoomController(dealRoomHubAddress, roomAddress, provider.getSigner(ROOM_1.seller))
        expect(dealRoomController).toBeDefined()
        await dealRoomController.init()
        deal1 = {
            erc20: demoEnvironment.deployedEnvironment.erc20.address,
            erc721: demoEnvironment.deployedEnvironment.erc721.address,
            price: new BigNumber(100),
            assetItems: demoEnvironment.erc721Allocations[ROOM_1.seller]
        }
        deal1 = await dealRoomController.makeDeal(deal1)
        expect(deal1.id).toBeDefined()
    })
})