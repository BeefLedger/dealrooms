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
        //address arbitrator;
        //address sensor;
        //address documentApprover;
        IERC20 erc20;
        IERC721 erc721;
        uint256 price;
        uint256[] assetItems;
        address dealMultiSig;
        address agentMultiSig;
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

        //Index
        indexDeal(address(deal), _buyer, _seller, _erc20, _erc721, _price, _assetItems, address(dealMultiSig), address(0));

        emit DealCreated(address(deal), _buyer, _seller, address(_erc20), address(_erc721), _price, _assetItems);

        return address(deal);
    }

    function indexDeal(
        address _dealAddress, 
        address _buyer,
        address _seller,
        IERC20 _erc20,
        IERC721 _erc721,
        uint256 _price,
        uint256[] memory _assetItems,
        address _dealMultiSig,
        address _agentMultiSig
    ) private {
        //===Record deal details (without upsetting the compiler)
        //Add to list
        deals.push(_dealAddress);

        //Index by buyer and seller
        dealsByUser[_buyer].push(_dealAddress);
        dealsByUser[_seller].push(_dealAddress);
        //Index by address
        dealDetailsByAddress[address(_dealAddress)] = DealDetails(
            _dealAddress,
            _buyer,
            _seller,
            _erc20,
            _erc721,
            _price,
            _assetItems,
            _dealMultiSig,
            _agentMultiSig
        );
        /*dealDetailsByAddress[address(_dealAddress)].addr = _dealAddress;
        dealDetailsByAddress[address(_dealAddress)].buyer = _buyer;
        dealDetailsByAddress[address(_dealAddress)].seller = _seller;
        dealDetailsByAddress[address(_dealAddress)].erc20 = _erc20;
        dealDetailsByAddress[address(_dealAddress)].erc721 = _erc721;
        dealDetailsByAddress[address(_dealAddress)].price = _price;
        dealDetailsByAddress[address(_dealAddress)].assetItems = _assetItems;
        dealDetailsByAddress[address(_dealAddress)].dealMultiSig = _dealMultiSig;
        dealDetailsByAddress[address(_dealAddress)].agentMultiSig = _agentMultiSig;*/
    }

    function makeAdvancedDeal(
        address _buyer,
        address _seller,
        address _arbitrator,
        address _sensor,
        address _documentApprover,
        IERC20 _erc20,
        IERC721 _erc721,
        uint256 _price,
        uint256[] memory _assetItems
    ) public returns (address) {
        Deal deal = new Deal(_buyer, _seller, _erc20, _erc721, _price, _assetItems);
        
        //Make an Agent multisig, 2/3 
        MultiSigHashed agentMultiSig = makeAgentMultiSig(_buyer, _seller, _arbitrator);

        //Make a Deal multisig, 3/3
        MultiSigHashed dealMultiSig = makeDealMultiSig(_sensor, _documentApprover, address(agentMultiSig));

        //Give the deal to the Deal Multisig
        deal.changeOwner(address(dealMultiSig));

        //Save deal details
        indexDeal(address(deal), _buyer, _seller, _erc20, _erc721, _price, _assetItems, address(dealMultiSig), address(agentMultiSig));

        emit DealCreated(address(deal), _buyer, _seller, address(_erc20), address(_erc721), _price, _assetItems);

        return address(deal);
    }

    function makeAgentMultiSig(address _buyer, address _seller, address _arbitrator) private returns (MultiSigHashed) {
        address[] memory agentSignatories = new address[](3);
        agentSignatories[0] = _buyer;
        agentSignatories[1] = _seller; 
        agentSignatories[2] = _arbitrator; 
        MultiSigHashed agentMultiSig = new MultiSigHashed(agentSignatories, 2);
        return agentMultiSig;
    }

    function makeDealMultiSig(address _sensor, address _documentApprover, address _agentMultiSig) private returns (MultiSigHashed) {
        address[] memory dealSignatories = new address[](3);
        dealSignatories[0] = _sensor;
        dealSignatories[1] = _documentApprover; 
        dealSignatories[2] = _agentMultiSig; 
        MultiSigHashed dealMultiSig = new MultiSigHashed(dealSignatories, 3);
        return dealMultiSig;
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
