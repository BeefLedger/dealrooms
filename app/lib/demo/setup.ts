import { deployAll, DeployedEnvironment } from "../../ethereum/deploy/deploy";
import { sendEth } from "../../ethereum/utils";
import { ADMIN } from "../../lib/settings";
import { getProvider } from "../../services/chain/providerFactory";

//import { UserModel } from "../db/users/users.model";
//import { connect, disconnect } from "../db/connection"

const ERC20_DEMO_AMOUNT = 10000

export type DemoEnvironment = {
    deployedEnvironment?: DeployedEnvironment
    erc20Allocations?: { [address: string]: number }
    erc721Allocations?: { [address: string]: number[] }   
}

export const demoEnvironment: DemoEnvironment = {
    erc721Allocations: {},
    erc20Allocations: {}
}

export async function setupDemo(accounts: any[] ): Promise<DemoEnvironment> {
    
    const provider = await getProvider()
    // Create ERC-721 contract
    // Create ERC-20 contract
    // Create DealRoomHub
    demoEnvironment.deployedEnvironment = await deployAll(provider.getSigner(ADMIN))
    console.log(JSON.stringify(accounts))
    try {
        await demoEnvironment.deployedEnvironment.erc20.addMinter(ADMIN)
    }
    catch (e) {
        console.warn("Didn't add ERC-20 minter")
    }

    try {
        await demoEnvironment.deployedEnvironment.erc721.addMinter(ADMIN)
    }
    catch (e) {
        console.warn("Didn't add ERC-721 minter")
    }
    
    let assetId = 0

    for (const acct of accounts) {
        demoEnvironment.erc721Allocations[acct.address] = []
        console.log(`Sending ETH to ${acct.address} ${acct.name}`)
        await sendEth(acct.address, 0.5, provider.getSigner())
        console.log(`Minting coins to ${acct.address} ${acct.name}`)
        demoEnvironment.deployedEnvironment.erc20.mint(acct.address, ERC20_DEMO_AMOUNT)
        demoEnvironment.erc20Allocations[acct.address] = ERC20_DEMO_AMOUNT
        for (let i=0; i<5; i++) {
            assetId++
            console.log(`Minting asset ${assetId} to ${acct.address} (${acct.name})`)
            await demoEnvironment.deployedEnvironment.erc721.mint(acct.address, assetId)
            demoEnvironment.erc721Allocations[acct.address].push(assetId)
        }
    }

    console.log(`erc721: ${demoEnvironment.deployedEnvironment.erc721.address}`)
    console.log(`erc20: ${demoEnvironment.deployedEnvironment.erc20.address}`)

    return demoEnvironment;
}
