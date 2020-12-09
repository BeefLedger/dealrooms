import { deployAll, DeployedEnvironment } from "../ethereum/deploy/deploy";
import { sendEth } from "../ethereum/utils";
import { getProvider } from "../services/chain/providerFactory";

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

export async function setupDemo(adminAddress, accounts: any[] ): Promise<DemoEnvironment> {
    const provider = await getProvider()
    // Create ERC-721 contract
    // Create ERC-20 contract
    // Create DealRoomHub
    demoEnvironment.deployedEnvironment = await deployAll(provider.getSigner(adminAddress))

    let assetId = 0
    for (const acct of accounts) {
        demoEnvironment.erc721Allocations[acct.address] = []
        await sendEth(acct.address, 0.1, provider.getSigner())
        demoEnvironment.deployedEnvironment.erc20.mint(acct.address, ERC20_DEMO_AMOUNT)
        demoEnvironment.erc20Allocations[acct.address] = ERC20_DEMO_AMOUNT
        for (let i=0; i<5; i++) {
            assetId++
            await demoEnvironment.deployedEnvironment.erc721.mint(acct.address, assetId)
            demoEnvironment.erc721Allocations[acct.address].push(assetId)
        }
    }

    return demoEnvironment;
}
