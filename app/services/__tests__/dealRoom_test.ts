
import { JsonRpcProvider } from "ethers/providers"

import { ADMIN, DEFAULT_ACCOUNTS } from "../../lib/settings"
import { getProvider } from "../../services/chain/providerFactory"
import { DealRoomController } from "../../services/dealRoomController"
import { DealRoomCreateParams, DeployedEnvironment } from "../../ethereum/deploy/deploy"
import { setupDemo } from "../../lib/demo/setup"

let deployedEnvironment: DeployedEnvironment
let dealRoomHubAddress: string
let provider: JsonRpcProvider

const ROOM_1 = {
    buyer: DEFAULT_ACCOUNTS[5].address,
    seller: DEFAULT_ACCOUNTS[6].address,
    arbitrator: DEFAULT_ACCOUNTS[0].address,
    docApprover: DEFAULT_ACCOUNTS[3].address,
    sensorApprover: DEFAULT_ACCOUNTS[2].address,
}
jest.setTimeout(3 * 60 * 1000)

describe("Deploy dealroom", () => {
    beforeAll(async ()=> {
        //Deploy ERC20 and ERC720, mint some and assign them
        provider = await getProvider()
        deployedEnvironment = await setupDemo()
        dealRoomHubAddress = deployedEnvironment.DealRoomHub.address
        // expect(dealRoomHubAddress).toBeDefined()
    })

    it("Makes a room", async () => {
        if (!deployedEnvironment.DealRoomHub) {
            fail("Not all contracts deployed")
        }
        const dealRoomCreateParams: DealRoomCreateParams = {
            dealRoomHubAddress,
            ...ROOM_1
        }
        DealRoomController.deployRoom(dealRoomCreateParams, provider.getSigner(ADMIN))
    })

})