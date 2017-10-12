const SentimentAnalysis = artifacts.require("SentimentAnalysis");

module.exports = async function(deployer, network, accounts) {
    await deployer.deploy(SentimentAnalysis);
};