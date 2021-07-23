// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

enum DealStatus {
    Open,
    Cancelled,
    Settled
}

struct DealStruct {
    address buyer;
    address seller;
    IERC20 erc20;
    IERC721 erc721;
    uint256 price;
    uint256[] assetItems;
    DealStatus status;
}

/// @title Deal -- allows atomic swap for ERC20/ERC721
/// @author Barry Earsman
contract Deal {
    address public creator;
    address public owner;
    address public buyer;
    address public seller;
    IERC20 erc20;
    IERC721 erc721;
    uint256 price;
    uint256[] assetItems;
    DealStatus status;
    bool private settled;

    event Debug(bytes32 message, uint num);
    event DealSettled();
    event DealCanceled();
    event DealCreated();
    event DealAssetsWithdrawn(uint qty);
    event DealCoinsWithdrawn();

    // This contract will allow atomic swaps for ERC20/ERC721
    // The contract will have a price, and will have a list of assets to swap

    constructor (address _buyer, address _seller, IERC20 _erc20, IERC721 _erc721, uint256 _price, uint256[] memory _assetItems) {
        owner = msg.sender;
        creator = msg.sender;
        buyer = _buyer;
        seller = _seller;
        erc20 = _erc20;
        erc721 = _erc721;
        price = _price;
        assetItems = _assetItems;
        status = DealStatus.Open;
        settled = false;
    }

    function getDeal() public view returns (DealStruct memory deal) {
        return DealStruct(buyer, seller, erc20, erc721, price, assetItems, status);
    }

    function missingDealAssets() public view returns (uint256) {
        //Check that all the assets have been deposited, and return the quantity missing    
        uint256 assetDeposits = 0;
        for (uint i = 0; i < assetItems.length; i ++) {
            // Check that I (the dealroom contract) own this asset
            if (erc721.ownerOf(assetItems[i]) == address(this)) {
                assetDeposits ++;
            }
        }
        return (assetItems.length - assetDeposits);
    }

    function canBuy() public view returns (bool) {
        //Check that the buyer has enough tokens to buy the deal
        return erc20.balanceOf(buyer) >= price;
    }

    function assetOwner(
        uint256 assetId
    ) public view returns (address) {
        return erc721.ownerOf(assetId);
    }

    function dealAssetsDeposited() public view  returns (uint256) {
        //Check that all the assets have been deposited, and return the quantity missing    
        uint256 assetDeposits = 0;
        for (uint i = 0; i < assetItems.length; i ++) {
            // Check that I (the dealroom contract) own this asset
            if (erc721.ownerOf(assetItems[i]) == address(this)) {
                assetDeposits ++;
            }
        }
        return assetDeposits;
    }

    function missingDealCoins() public view  returns (uint256) {
        //Check that all the coins have been deposited, and return the amount missing
        uint256 balance = erc20.balanceOf(address(this));
        if (balance >= price) {
            return 0;
        }
        return price - balance;
    }

    // Change the status to Settled, which will allow the buyer to withdraw the tokens, and the seller to withdraw the assets
    function settle() public dealOpen() isOwner() {
        require(missingDealAssets() == 0, "DEAL_ASSETS_MISSING");
        require(missingDealCoins() == 0, "DEAL_TOKENS_MISSING");

        _setDealStatus(DealStatus.Settled);
        emit DealSettled();
    }

    function _setDealStatus(
        DealStatus _status
    ) private  {
        status = _status;
    }

    //Transfer a batch of assets
    function withdrawDealAssets(uint256 count) public {
        uint256 transferred = 0;

        if (status == DealStatus.Settled) {
            require(msg.sender == buyer, "BUYER_ONLY");
        } else {
            require(msg.sender == seller, "SELLER_ONLY");
        }

        for (uint i = 0; i < assetItems.length; i ++) {
            if (transferred < count && erc721.ownerOf(assetItems[i]) == address(this)) {
                erc721.transferFrom(address(this), msg.sender, assetItems[i]);
                transferred ++;
            }
        }
        emit DealAssetsWithdrawn(count);
    }

    function withdrawDealCoins() public isSeller() dealSettled() {
        if (status == DealStatus.Settled) {
            require(msg.sender == seller, "SELLER_ONLY");
        } else {
            require(msg.sender == buyer, "BUYER_ONLY");
        }
        erc20.transfer(msg.sender, price);
        emit DealCoinsWithdrawn();
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function getBuyer() public view returns (address) {
        return buyer;
    }

    function getSeller() public view returns (address) {
        return seller;
    }

    function changeOwner(address newOwner) public isOwner() {
        owner = newOwner;
    }

    modifier dealOpen() {
        require(status == DealStatus.Open, "DEAL_NOT_OPEN");
        _;
    }

    modifier dealSettled() {
        require(status == DealStatus.Settled, "DEAL_NOT_SETTLED");
        _;
    }

    modifier isOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }

    modifier isBuyer() {
        require(msg.sender == buyer, "ONLY_BUYER");
        _;
    }

    modifier isSeller() {
        require(msg.sender == seller, "ONLY_SELLER");
        _;
    }

    modifier isMember() {
        require(msg.sender == buyer || msg.sender == seller, "NOT_MEMBER");
        _;
    }
}
