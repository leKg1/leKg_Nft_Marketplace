const GouabyToken = artifacts.require("GouabyToken");

module.exports = function (deployer) {
  deployer.deploy(GouabyToken);
};
