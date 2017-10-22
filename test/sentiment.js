const SentimentAnalysis = artifacts.require("SentimentAnalysis");
const assertFail = require("./helpers/assertFail");
const eventsUtil = require("./helpers/eventsUtil");

let sentimentAnalysis;
let ownerAddress;
let today = new Date();
let todayISO = today.toISOString();

let oneWeekFromToday = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000));

contract("SentimentAnalysis", function(accounts) {

    console.log('Logging out all of the accounts for reference...');
    accounts.forEach(acc => console.log(acc + " -> " + web3.fromWei(web3.eth.getBalance(acc), "ether").toNumber() + " ETH"));

    ownerAddress = accounts[0];
    console.log("ownerAddress " + ownerAddress);

    before(async function() {
        sentimentAnalysis = await SentimentAnalysis.new();
    });

    after(async function() {
        sentimentAnalysis = null;
    });

    it('should not accept Ether payments', async function() {
        await assertFail(async function() {
            await sentimentAnalysis.sendTransaction({
                value: web3.toWei(1), 
                gas: 3000000, 
                gasPrice: "20000000000", 
                from: accounts[1]
            });
        });
    });

    it('should not find reputation for user before reputations are updated', async function() {
        await sentimentAnalysis.getReputation(accounts[1],
            {
                from: ownerAddress
            }
        )
        .then(function(result) {
            assert.equal(result[0], ""); // reputation
            assert.equal(result[1], 0); // correct
            assert.equal(result[2], 0); // incorrect
            assert.equal(result[3], ""); // lastUpdatedDate
            assert.equal(result[4], ""); // lastFormulaApplied
        });
    });

    it('should not be able to update reputations if not owner', async function() {
        await assertFail(async function() {
            await sentimentAnalysis.updateReputation(
                "0.525", 1, 0, todayISO, "0.5 + (0.5*0.05)", accounts[1],
                {
                    from: accounts[1]
                }
            )
        });
    });

    it('should be able to update reputations if owner', async function() {
        await sentimentAnalysis.updateReputation(
            "0.525", 1, 0, todayISO, "0.5 + (0.5*0.05)", accounts[1],
            {
                from: ownerAddress
            }
        )
        .then(result => {
            eventsUtil.eventValidator(
                result, 
                {
                    name: "ReputationUpdated",
                    args: {
                        reputation: "0.525",
                        correct: 1,
                        incorrect: 0,
                        lastUpdateDate: todayISO,
                        lastFormulaApplied: "0.5 + (0.5*0.05)",
                        user: accounts[1]
                    }
                }
            );
        });
    });
    
    it('should be able to retrieve reputation for user if owner', async function() {
        await sentimentAnalysis.getReputation(accounts[1],
            {
                from: ownerAddress
            }
        )
        .then(result => {
            assert.equal(result[0], "0.525"); // reputation
            assert.equal(result[1], 1); // correct
            assert.equal(result[2], 0); // incorrect
            assert.equal(result[3], todayISO); // lastUpdatedDate
            assert.equal(result[4], "0.5 + (0.5*0.05)"); // lastFormulaApplied
        });
    });

    it('should be able to retrieve reputation about somebody else if ordinary user', async function() {
        await sentimentAnalysis.getReputation(accounts[1],
            {
                from: accounts[2]
            }
        )
        .then(result => {
            assert.equal(result[0], "0.525"); // reputation
            assert.equal(result[1], 1); // correct
            assert.equal(result[2], 0); // incorrect
            assert.equal(result[3], todayISO); // lastUpdatedDate
            assert.equal(result[4], "0.5 + (0.5*0.05)"); // lastFormulaApplied
        });
    });

    it('should be able to update existing reputations again if owner', async function() {
        await sentimentAnalysis.updateReputation(
            "0.55125", 2, 0, todayISO, "0.525 + (0.525*0.05)", accounts[1],
            {
                from: ownerAddress
            }
        )
        .then(result => {
            eventsUtil.eventValidator(
                result, 
                {
                    name: "ReputationUpdated",
                    args: {
                        reputation: "0.55125",
                        correct: 2,
                        incorrect: 0,
                        lastUpdateDate: todayISO,
                        lastFormulaApplied: "0.525 + (0.525*0.05)",
                        user: accounts[1]
                    }
                }
            );
        });
    });

    it('should be able to retrieve updated reputation for user if owner', async function() {
        await sentimentAnalysis.getReputation(accounts[1],
            {
                from: ownerAddress
            }
        )
        .then(result => {
            assert.equal(result[0], "0.55125"); // reputation
            assert.equal(result[1], 2); // correct
            assert.equal(result[2], 0); // incorrect
            assert.equal(result[3], todayISO); // lastUpdatedDate
            assert.equal(result[4], "0.525 + (0.525*0.05)"); // lastFormulaApplied
        });
    });
});