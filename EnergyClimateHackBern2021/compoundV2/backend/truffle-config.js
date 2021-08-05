module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*"
    }
  },

  compilers: {
    solc: {
      settings: {
        // Required because large size of cToken and cEther contracts
        optimizer: {
          enabled: true,
          runs: 1000
        },
      }
    }
  },
};
