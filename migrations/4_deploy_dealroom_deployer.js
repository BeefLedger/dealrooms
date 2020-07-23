const DealRoomDeployer = artifacts.require('DealRoomDeployer.sol')

module.exports = async function(deployer) {
    await deployer.deploy(DealRoomDeployer);
};