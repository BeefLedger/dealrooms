const ERC20Detailed = artifacts.require('../ERC20/ERC20Detailed.sol')

module.exports = function(deployer) {
  deployer.deploy(ERC20Detailed, "Investor Engine", "IEN", 1).then(async () => {
    //const eRC20DetailedContract = 
    await ERC20Detailed.deployed();
    //await eRC20DetailedContract.transferOwnership("0x658040983DD50DD44826FC7e414626Bb8b8180A9"); 
    //await eRC20DetailedContract.addMinter("0x658040983DD50DD44826FC7e414626Bb8b8180A9"); 
    //await eRC20DetailedContract.renounceMinter(); 
  });
};