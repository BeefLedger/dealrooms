import { setupDemo } from "../../ethereum/demo/setup"

export default async (req, res) => {
    console.log("Setting up demo")
    const de = await setupDemo()
    const response = {
        "erc20": de.erc20.address,
        "erc721": de.erc721.address
    }
    res.status(200).json(response)
}