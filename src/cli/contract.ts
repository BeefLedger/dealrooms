import * as yargs from "yargs";
import { deployErc20, deployErc721, deployDealRoomDeployer, DeployedEnvironment } from "../deploy/deploy";

type Args = {
    name: string;
    verbose?: boolean;
    erc20Owner?: string;
    erc721Owner?: string;
};

const Names = {
    ALL: "all",
    ERC20: "erc20",
    ERC721: "erc721",
    DEALROOM_DEPLOYER: "drd",
}
const NameOptions = [Names.ALL, Names.ERC20, Names.ERC721, Names.DEALROOM_DEPLOYER]

async function main() {
    yargs.command(
        'deploy',
        'Deploy one or all contracts',
        (yargs) => {
            return yargs.option(
                "verbose",
                {
                    alias: "v",
                    type: "boolean",
                    default: "false",
                    describe: "Output lots of info"
                } 
            )
            .option(
                "erc20Owner",
                {
                    type: "string",
                    describe: "Address to be made owner of the ERC20 contract, who will be given minting rights"
                } 
            )
            .option(
                "erc721Owner",
                {
                    type: "string",
                    describe: "Address to be made owner of the ERC721 contract, who will be given minting rights"
                } 
            )
            .positional(
                'name', {
                    describe: "",
                    type: "string",
                    default: Names.ALL,  
                }
            )
            .help()
        },
        async (yargs) => {
            const args: Args = yargs.argv as Args;
            const all: boolean = args.name === Names.ALL;
            const result: DeployedEnvironment = {};
            if (args.name === Names.DEALROOM_DEPLOYER || all) {
                result.dealRoomDeployer = await deployDealRoomDeployer();
            }
            if (args.name === Names.ERC20 || all) {
                result.erc20 = await deployErc20(args.erc20Owner);
            }
            if (args.name === Names.ERC721 || all) {
                result.erc721 = await deployErc721(args.erc721Owner);
            }
            console.log(JSON.stringify(result, undefined, 4));
        }
    ).help().argv

}

main()
    .then(() => {
        console.log("Bye!");
        process.exit(0);
    })
    .catch(e => {
        console.error(e.stack);
        process.exit(1);
    });
