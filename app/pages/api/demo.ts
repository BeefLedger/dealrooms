import { setupDemo } from "../../lib/demo/setup"

export default async (req, res) => {
    console.log("Setting up demo")
    const de = await setupDemo()
    const response = {
        "erc20": de.erc20.address,
        "erc721": de.erc721.address,
        "DealRoomHub": de.DealRoomHub.address,
    }
    res.status(200).json(response)
}