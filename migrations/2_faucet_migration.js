// https://www.udemy.com/course/solidity-ethereum-in-react-next-js-the-complete-guide/learn/lecture/28623956#overview

const FaucetContract = artifacts.require("Faucet");

module.exports = function (deployer) {
  deployer.deploy(FaucetContract);
};
