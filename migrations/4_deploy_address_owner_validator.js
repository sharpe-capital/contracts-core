const AddressOwnerValidator = artifacts.require("AddressOwnerValidator");

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(AddressOwnerValidator);
};