import { ADMIN, DEMO_ACCOUNTS } from "lib/settings"
import { setupDemo } from "../../lib/demo/setup"

export default async (req, res) => {
    const demoEnv = await setupDemo(ADMIN, DEMO_ACCOUNTS)
    const response = {
        "erc20": demoEnv.deployedEnvironment.erc20.address,
        "erc721": demoEnv.deployedEnvironment.erc721.address,
        "DealRoomHub": demoEnv.deployedEnvironment.DealRoomHub.address,
    }
    res.status(200).json(response)
}