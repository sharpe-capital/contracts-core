module.exports = {
    rpc: {
        host: "localhost",
        port: 8545
    },
    networks: {
        development: {
            network_id: 15,
            host: "localhost",
            port: 8545,
            gas: 6000000,
            gasPrice: 20e9,
        },
        testnet: {
            network_id: 3,
            host: "34.240.84.166",
            port: 8545,
            gas: 4000000,
            gasPrice: 20e9,
        },
        mainnet: {
            network_id: 1,
            host: "34.251.44.7",
            port: 8545,
            gas: 4000000,
            gasPrice: 20e9,
        },
    }
};