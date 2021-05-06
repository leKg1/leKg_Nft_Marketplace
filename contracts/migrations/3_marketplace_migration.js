const LeKgMarketContract = artifacts.require("LeKgMarketContract");

module.exports = function (deployer) {
  deployer.deploy(LeKgMarketContract);
};
