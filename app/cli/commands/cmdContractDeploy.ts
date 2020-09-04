import { deployErc20, deployErc721 } from "../../ethereum/deploy/deploy";

const Names = {
    ALL: "all",
    ERC20: "erc20",
    ERC721: "erc721",
    DEALROOM: "dr",
    DEALROOM_DEPLOYER: "drd",
}

type Args = {
    name: string;
    verbose?: boolean;
    erc20Owner: string;
    erc721Owner: string;
    drdOwner?: string;
};


exports.command = 'deploy'
exports.aliases = ['dep']
exports.describe = 'Deploy one or all contracts'
exports.builder = (yargs) => {
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
    ).help()

}

exports.handler = async function(argv) {
    console.log(JSON.stringify(argv, undefined, 4))

    const args: Args = argv as Args;
    args.name = args.name.toLowerCase()
    const all: boolean = args.name === Names.ALL

    if (args.name === Names.ERC20 || all) {
        console.log(Names.ERC20, (await deployErc20(args.erc20Owner)).address)
    }
    if (args.name === Names.ERC721 || all) {
        console.log(Names.ERC721, (await deployErc721(args.erc721Owner)).address)
    }
}