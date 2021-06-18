pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestCoin is ERC20 {
    constructor() ERC20("Test Coin", "TCOI") {}

    function mint(address account, uint256 amount) public {
        super._mint(account, amount);
    }
}