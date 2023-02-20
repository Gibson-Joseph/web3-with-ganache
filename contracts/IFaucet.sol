// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// They cannot inherit from other smart contracts
// They can only inherit from other interfaces

// They cannot declare a constructor
// They cannot declare state variable
// All declarder function have to be external
interface IFaucet {
    function addFunds() external payable; // must be external

    function withdraw(uint256 withdrawAmount) external;
}
