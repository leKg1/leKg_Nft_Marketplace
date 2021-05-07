// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LeSpaceToken is ERC20 {
    constructor() ERC20("LeSpaceToken", "LST") {
        uint256 oneLST = 1000000000000000000;
        uint256 hundredMillion = 100000000;
        _mint(msg.sender,oneLST*hundredMillion);
    }
}