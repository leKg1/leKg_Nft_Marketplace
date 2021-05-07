const DiscoveryArtToken = artifacts.require("DiscoveryArtToken");

module.exports = function (deployer) {
  deployer.deploy(DiscoveryArtToken);
};
