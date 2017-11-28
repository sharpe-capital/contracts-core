const AddressOwnerValidator = artifacts.require("AddressOwnerValidator");
const assertFail = require("./helpers/assertFail");
const eventsUtil = require("./helpers/eventsUtil");

let addressOwnerValidator;
const GAS = 3000000;
const GAS_PRICE = 20000000000;

contract("AddressOwnerValidator", function(accounts) {

    console.log('Logging out all of the accounts for reference...');
    accounts.forEach(acc => console.log(acc + " -> " + web3.fromWei(web3.eth.getBalance(acc), "ether").toNumber() + " ETH"));

    before(async function() {
        addressOwnerValidator = await AddressOwnerValidator.new(GAS, {value:  web3.toWei(10)});
    });

    after(async function() {
        addressOwnerValidator = null;
    });

    it('should refund transaction and store user information', async function() {
        let usedGas = 0; 
        let refunded = 0;
        let dateVerified = 0;
        let paid = 0;

        let transactionValue = web3.toWei(1);
        await addressOwnerValidator.sendTransaction({
            value: transactionValue, 
            gas: GAS, 
            gasPrice: GAS_PRICE, 
            from: accounts[1]
        }).then(result => {
            eventsUtil.eventLogger(result);
            
            usedGas = result.logs[0].args["usedGas"];
            console.log("usedGas " + usedGas);

            refunded = result.logs[0].args["refunded"].toNumber();
            console.log("refunded " + refunded);

            dateVerified = result.logs[0].args["date"].toNumber();
            console.log("dateVerified " + dateVerified);

            paid = result.logs[0].args["paid"].toNumber();
            console.log("paid " + paid);

        });

        let gasInWei = usedGas * GAS_PRICE;
        console.log("gasInWei " + gasInWei);

        let accountEth = await web3.eth.getBalance(accounts[1]).toNumber();
        console.log("accountEth " + accountEth);

        const result = await addressOwnerValidator.transfers.call(accounts[1]);
        console.log("result " + result);
        assert.equal(result.toNumber(), transactionValue);
    });


    it('should reject subsequent transactions for a given user', async function() {
        let transactionValue = web3.toWei(1);
        await addressOwnerValidator.sendTransaction({
            value: transactionValue, 
            gas: GAS, 
            gasPrice: GAS_PRICE, 
            from: accounts[2]
        });

        await assertFail(async function() {
            await addressOwnerValidator.sendTransaction({
                value: transactionValue, 
                gas: GAS, 
                gasPrice: GAS_PRICE, 
                from: accounts[2]
            })
        });
    });

    it('should not accept 0 ETH transactions', async function() {
        let transactionValue = web3.toWei(0);

        await assertFail(async function() {
            await addressOwnerValidator.sendTransaction({
                value: transactionValue, 
                gas: GAS, 
                gasPrice: GAS_PRICE, 
                from: accounts[3]
            })
        });
    });
});