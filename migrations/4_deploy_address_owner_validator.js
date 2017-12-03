const AccountOwnership = artifacts.require("AccountOwnership");

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(AccountOwnership);
};