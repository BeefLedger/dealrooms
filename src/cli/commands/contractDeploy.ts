const Names = {
    ALL: "all",
    ERC20: "erc20",
    ERC721: "erc721",
    DEALROOM: "dr",
    DEALROOM_DEPLOYER: "drd",
}

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

exports.handler = function(argv) {
    console.log(JSON.stringify(argv, undefined, 4))
}