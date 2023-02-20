// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "./Owned.sol";
import "./Logger.sol";
import "./IFaucet.sol";

contract Faucet is Owned, Logger, IFaucet {
    // // Storage Variables
    // uint public funds = 1000;
    // int public counter = -10;
    // uint32 public test = 4294967295;
    uint256 public numbersOfFunders; //default value is zero 0
    mapping(address => bool) public funders;
    mapping(uint256 => address) public lutFunders;

    function test1() external onlyOwner {}

    modifier limitWithdraw(uint256 withdrawAmount) {
        require(
            withdrawAmount <= 1000000000000000000,
            "cannot withdraw more then 1 ETH"
        );
        _; // this is mentions the functions body
    }

    // https://www.udemy.com/course/solidity-ethereum-in-react-next-js-the-complete-guide/learn/lecture/28624014#overview
    // https://www.udemy.com/course/solidity-ethereum-in-react-next-js-the-complete-guide/learn/lecture/28624016#overview
    // this is a special function
    // it's called when you make a tx that doesn't specify functiion name to call

    // External function are part of the contract interface
    // Which means they can be called via contracts and other txs

    receive() external payable {} // receive is a special function

    function emitLog() public pure override returns (bytes32) {
        return "Hello World";
    }

    function addFunds() external payable override {
        // instance.addFunds({form:accounts[0],value:3000000000000000000})
        address funder = msg.sender;
        if (!funders[funder]) {
            funders[funder] = true;
            lutFunders[numbersOfFunders] = funder;
            numbersOfFunders++;
        }
    }

    function withdraw(uint256 withdrawAmount)
        external
        override
        limitWithdraw(withdrawAmount)
    {
        // instance.withdraw("1000000000000000000",{from:accounts[0]})
        // https://www.udemy.com/course/solidity-ethereum-in-react-next-js-the-complete-guide/learn/lecture/28624122#learning-tools
        payable(msg.sender).transfer(withdrawAmount);
    }

    function getAllFunders() external view returns (address[] memory) {
        address[] memory funder = new address[](numbersOfFunders);
        for (uint256 i = 0; i < numbersOfFunders; i++) {
            funder[i] = lutFunders[i];
        }
        return funder;
    }

    function getFunderAtIndex(uint256 index) external view returns (address) {
        return lutFunders[index];
    }
}
