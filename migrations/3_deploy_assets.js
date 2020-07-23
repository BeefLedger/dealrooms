const ERC721Detailed = artifacts.require('../ERC721/ERC721Detailed.sol')

module.exports = function(deployer) {
  deployer.deploy(ERC721Detailed, "Cattle", "CAT").then(async () => {
    const erc721DetailedContract = await ERC721Detailed.deployed();
    await erc721DetailedContract.transferOwnership("0x658040983DD50DD44826FC7e414626Bb8b8180A9"); 
    await erc721DetailedContract.addMinter("0x658040983DD50DD44826FC7e414626Bb8b8180A9"); 
    // await erc721DetailedContract.renounceMinter(); 
  });
};