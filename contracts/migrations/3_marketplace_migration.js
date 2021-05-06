const MarketContract = artifacts.require("MarketContract");

module.exports = function (deployer) {
  deployer.deploy(MarketContract);
};
