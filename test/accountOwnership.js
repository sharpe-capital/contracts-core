const AccountOwnership = artifacts.require("AccountOwnership");
const assertFail = require("./helpers/assertFail");
const eventsUtil = require("./helpers/eventsUtil");

let accountOwnership;
const GAS = 3000000;
const GAS_PRICE = 20000000000;

contract("AccountOwnership", function(accounts) {

    console.log('Logging out all of the accounts for reference...');
    accounts.forEach(acc => console.log(acc + " -> " + web3.fromWei(web3.eth.getBalance(acc), "ether").toNumber() + " ETH"));

    before(async function() {
        accountOwnership = await AccountOwnership.new({value:  web3.toWei(10)});
    });

    after(async function() {
        accountOwnership = null;
    });

    it('should refund transaction and store user information', async function() {
        let usedGas = 0; 
        let refunded = 0;
        let dateVerified = 0;
        let paid = 0;

        let transactionValue = web3.toWei(1);
        await accountOwnership.sendTransaction({
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

        const result = await accountOwnership.transfers.call(accounts[1]);
        console.log("result " + result);
        assert.equal(result.toNumber(), transactionValue);
    });

    it('should not accept 0 ETH transactions', async function() {
        let transactionValue = web3.toWei(0);

        await assertFail(async function() {
            await accountOwnership.sendTransaction({
                value: transactionValue, 
                gas: GAS, 
                gasPrice: GAS_PRICE, 
                from: accounts[3]
            });
        });
    });

    it('should set deposit ETH address', async function() {
        await accountOwnership.setDepositAddress(accounts[2]);
        let depositAddress = await accountOwnership.depositAddress();
        assert.equal(depositAddress, accounts[2]);
    });

    it('should deposit ETH without a refund from deposit address', async function() {
        let transactionValue = web3.toWei(1);
        let accountEthBefore = await web3.eth.getBalance(accountOwnership.address).toNumber();
        await accountOwnership.sendTransaction({
            value: transactionValue, 
            gas: GAS, 
            gasPrice: GAS_PRICE, 
            from: accounts[2]
        });
        let accountEth = await web3.eth.getBalance(accountOwnership.address).toNumber();
        assert.equal(accountEth, (Number(accountEthBefore) + Number(transactionValue)));
    });

    it('should allow owner to withdraw ETH', async function() {
        await accountOwnership.withdrawEther(accounts[1]);
        let accountEth = await web3.eth.getBalance(accountOwnership.address).toNumber();
        assert.equal(accountEth, 0); 
    });
});