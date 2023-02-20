// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Storage {
    // https://www.udemy.com/course/solidity-ethereum-in-react-next-js-the-complete-guide/learn/lecture/28624074#overview
    uint8 public a = 7; //1byte
    uint16 public b = 10; // 2byte
    address public c = 0x846781d48EE9231Fa0EA0b0C0855f711C2fE88d2; // 20 byte
    bool d = true; // 1 byte
    uint64 public e = 15; //8 bytes
    // 32 bytes, all value will be stored in slot 0
    // 0x 0f 01 846781d48ee9231fa0ea0b0c0855f711c2fe88d2 000a 07

    uint256 public f = 200; // 32 bytes -> slot 1
    // '0xc8'

    uint8 public g = 40; // 1byte -> slot 2
    // '0x28'

    uint256 public h = 789; // 32bytes -> slot 3
    // '0x0315'
}
