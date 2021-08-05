
  const FakeDai = artifacts.require("./FakeDai");
  const FakeCDai = artifacts.require("./FakeCDai");
  const FakeComptroller = artifacts.require("./FakeComptroller");
  const FakeCDaiInterestRateModel = artifacts.require("./FakeCDaiInterestRateModel");
  const FakePriceOracle = artifacts.require("./FakeCPriceOracle");
  
module.exports = async (deployer, network, accounts) => {
  // Only setup Compound on local blockchain
  if (network !== 'development') return;

    // 2. Deploy Interest Model Contract for cDAI
    await deployer.deploy(FakeCDaiInterestRateModel, {from: accounts[1]})
   
    // 3. Deploy Comptroller Contract
    await deployer.deploy(FakeComptroller, {from: accounts[1]})

    //4. Deploy Price Oracle Contract
    await deployer.deploy(FakePriceOracle, {from: accounts[1]})

    // 5. Owner/Admin deploys cDAI Contract (accounts[1])
    await deployer.deploy(
      FakeCDai,
      FakeDai.address,
      FakeComptroller.address,
      FakeCDaiInterestRateModel.address
    , {from: accounts[1]})

    // 6. Activate FakecDai Market
    await FakeComptroller.deployed()
    .then(instance => {

      instance._supportMarket(FakeCDai.address, {from: accounts[1]})

      // 7. Set Price Oracle
      instance._setPriceOracle(FakePriceOracle.address, {from: accounts[1]})

      // 8. Set Collateral Factor of 0.9 
      instance._setCollateralFactor(FakeCDai.address, "900000000000000000", {from: accounts[1]} )

      // 9. Set Max. Assets of 5000 FakecDai
      instance._setMaxAssets("5000000000000000000000",{from: accounts[1]})

    })

};
