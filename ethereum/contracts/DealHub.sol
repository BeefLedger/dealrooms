// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity ^0.8.0;

import "./Deal.sol";
import "./multisig/MultiSigHashed.sol";

contract DealHub {
    address owner;

    struct DealDetails {
        address addr;
        address buyer;
        address seller;
        address dealMultiSig;
    }

    mapping (address => address[]) private dealsByUser;
    mapping (address => DealDetails) private dealDetailsByAddress;

    address[] private deals;

    event DealCreated(address addr, address buyer, address seller, address erc20, address erc721, uint256 price, uint256[] assets);

    function makeDeal(
        address _buyer,
        address _seller,
        IERC20 _erc20,
        IERC721 _erc721,
        uint256 _price,
        uint256[] memory _assetItems
    ) public returns (address) {
        Deal deal = new Deal(_buyer, _seller, _erc20, _erc721, _price, _assetItems);

        //Make a deal multisig, 2/2 with Agents
        address[] memory signatories = new address[](2);
        signatories[0] = _buyer;
        signatories[1] = _seller; 
        MultiSigHashed dealMultiSig = new MultiSigHashed(signatories, 2);   

        //Give the deal to the Multisig
        deal.changeOwner(address(dealMultiSig));

        //===Record deal details (without upsetting the compiler)
        //Add to list
        deals.push(address(deal));

        //Index by buyer and seller
        dealsByUser[_buyer].push(address(deal));
        dealsByUser[_seller].push(address(deal));

        //Index by address
        dealDetailsByAddress[address(deal)].addr = address(deal);
        dealDetailsByAddress[address(deal)].buyer = _buyer;
        dealDetailsByAddress[address(deal)].seller = _seller;
        dealDetailsByAddress[address(deal)].dealMultiSig = address(dealMultiSig);

        emit DealCreated(address(deal), _buyer, _seller, address(_erc20), address(_erc721), _price, _assetItems);

        return address(deal);
    }

    function getUserDeals(address _user) public view returns(address[] memory) {
        return dealsByUser[_user];
    }
    function getDeal(address addr) public view returns (DealDetails memory) {
        return dealDetailsByAddress[addr];
    }
    function dealCount() public view returns (uint) {
        return deals.length;
    }

    function changeOwner(address newOwner) public isOwner() {
        owner = newOwner;
    }

    modifier isOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }
}
