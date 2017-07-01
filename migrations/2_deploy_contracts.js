var ProsperaToken = artifacts.require("./ProsperaToken.sol");
var Minter = artifacts.require("./Minter.sol");

module.exports = function(deployer) {
  deployer.deploy(ProsperaToken);
  deployer.link(ProsperaToken, Minter);
  deployer.deploy(Minter);
};
