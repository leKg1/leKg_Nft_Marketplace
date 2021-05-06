const DiscoveryArtTokenMarketContract = artifacts.require("DiscoveryArtTokenMarketContract");

module.exports = function (deployer) {
  deployer.deploy(DiscoveryArtTokenMarketContract);
};
