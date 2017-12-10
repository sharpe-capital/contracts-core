const AccountOwnership = artifacts.require("AccountOwnership");

module.exports = async function(deployer, network, accounts) {
    let accountOwnership = await AccountOwnership.new({value:  web3.toWei(2)});
};