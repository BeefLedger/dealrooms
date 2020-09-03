
pragma solidity ^0.5.0;

import "./ERC721Full.sol";
import "./ERC721Mintable.sol";
import "../ownership/Ownable.sol";

contract ERC721Detailed is ERC721Full, ERC721Mintable, Ownable {
  constructor(string memory _name, string memory _symbol) ERC721Full(_name, _symbol) public {
  }
}