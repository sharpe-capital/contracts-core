# Sharpe Capital Smart Contracts
The core smart contracts for the Sharpe Capital platform are contained within this repository. This currently includes:

- TradeLedger.sol - trustless trading ledger service
- SentimentAnalysis.sol - immutable record of reputation scores for sentiment providers

## Project Contributions

Please feel free to use the source code in this repository as inspiration for your own Solidity applications.

We're also happy to receive issues/PRs/bug reports. Please add tests for any changes.

#### Installing Dependencies

You need to install the Solidity and NPM dependencies to start this project:

`truffle install`

`npm install`

#### Running the Tests

Our tests are implemented using Truffle's JS testing Framework. You can run the tests with the following commands:

`testrpc -a 10 -l 4000000000` (run this in another Terminal tab)
`truffle test`
