import { deployAll, DeployedEnvironment } from "../../ethereum/deploy/deploy";
import { sendEth } from "../../ethereum/utils";
import { ADMIN, DEFAULT_ACCOUNTS } from "../../lib/settings";
import { getProvider } from "../../services/chain/providerFactory";

//import { UserModel } from "../db/users/users.model";
//import { connect, disconnect } from "../db/connection"

export let demoEnvironment: DeployedEnvironment

export async function setupDemo(): Promise<DeployedEnvironment> {
    if (demoEnvironment) return
    
    const provider = await getProvider()
    // Create ERC-721 contract
    // Create ERC-20 contract
    // Create DealRoomHub
    const de = await deployAll(provider.getSigner(ADMIN))
    const accounts = DEFAULT_ACCOUNTS //await provider.listAccounts()
    console.log(JSON.stringify(accounts))
    try {
        await de.erc20.addMinter(ADMIN)
    }
    catch (e) {
        console.warn("Didn't add ERC-20 minter")
    }

    try {
        await de.erc721.addMinter(ADMIN)
    }
    catch (e) {
        console.warn("Didn't add ERC-721 minter")
    }
    
    let assetId = 0

    for (const acct of accounts) {
        console.log(`Sending ETH to ${acct.address} ${acct.name}`)
        await sendEth(acct.address, 0.5, provider.getSigner())
        console.log(`Minting coins to ${acct.address} ${acct.name}`)
        de.erc20.mint(acct.address, 10000)
        for (let i=0; i<5; i++) {
            assetId++
            console.log(`Minting asset ${assetId} to ${acct.address} (${acct.name})`)
            await de.erc721.mint(acct.address, assetId)
        }
    }

    console.log(`erc721: ${de.erc721.address}`)
    console.log(`erc20: ${de.erc20.address}`)
    demoEnvironment = de;
    return de;
}

