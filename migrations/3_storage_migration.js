const storage = artifacts.require("Storage");

module.exports = (deployer) => {
  deployer.deploy(storage);
};
