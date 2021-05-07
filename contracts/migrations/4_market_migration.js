const MarketContract = artifacts.require("MarketContract");
const LeSpaceToken = artifacts.require("LeSpaceToken");

module.exports = async (deployer) => {
  await deployer.deploy(LeSpaceToken);
  const leSpaceTokenDeployed =  await LeSpaceToken.deployed();
  await deployer.deploy(MarketContract, leSpaceTokenDeployed.address);
};
