  
  const FakeDai = artifacts.require("./FakeDai");

module.exports = async (deployer, network, accounts) => {
  // Only setup Compound on local blockchain
  if (network !== 'development') return;

  // 1. DaiBank deploys DAI token contract (accounts[0])
  await deployer.deploy(FakeDai, {from: accounts[0]})

};
