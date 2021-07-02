// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";


/// @title DealRoom -- allows atomic swap for ERC20/ERC721
/// @author Barry Earsman
contract DealRoom {
    address public creator;
    address public owner;
    //IERC721 public erc721;
    //IERC20 public erc20;
    uint256 public dealCount;
    Deal[] public deals;
    //mapping(uint256 => Deal) private deals;
    bool private settled;
    address public buyer;
    address public seller;

    event Debug(bytes32 message, uint num);

    struct Deal {
        uint256 id;
        IERC20 erc20;
        IERC721 erc721;
        uint256 price;
        uint256[] assetItems;
        DealStatus status;
        bool valid;
    }

    enum DealStatus {
        Undefined,
        Open,
        Cancelled,
        Settled
    }

    constructor (address _buyer, address _seller) {
        buyer = _buyer;
        seller = _seller;
        dealCount = 0;
        owner = msg.sender;
        creator = msg.sender;
    }

    function makeDeal(
        IERC20 _erc20,
        IERC721 _erc721,
        uint256 _price,
        uint256[] memory _assetItems
    ) public  {

        deals.push(Deal({
            id: dealCount,
            erc20: _erc20,
            erc721: _erc721,
            price: _price,
            assetItems: _assetItems,
            status: DealStatus.Open,
            valid: true
        }));
        dealCount ++;
        // dealIds.push(_id);
    }

    function dealAssetCount(uint256 id) public view dealExists(id, true) returns (uint256) {
        Deal memory deal = getDeal(id);
        return deal.assetItems.length;
    }

    function missingDealAssets(
        uint256 id
    ) public view dealExists(id, true) returns (uint256) {
        //Check that all the assets have been deposited, and return the quantity missing    
        Deal memory deal = getDeal(id);
        /*if (deal.status == DealStatus.Settled) {
            return 0;
        }*/
        uint256 assetDeposits = 0;
        for (uint i = 0; i < deal.assetItems.length; i ++) {
            // Check that I (the dealroom contract) own this asset
            if (deal.erc721.ownerOf(deal.assetItems[i]) == address(this)) {
                assetDeposits ++;
            }
        }
        return (deal.assetItems.length - assetDeposits);
    }

    function assetOwner(
        uint256 dealId, uint256 assetId
    ) public view dealExists(dealId, true) returns (address) {
        Deal memory deal = getDeal(dealId);
        return deal.erc721.ownerOf(assetId);
    }

    function dealAssetsDeposited(
        uint256 id
    ) public view dealExists(id, true) returns (uint256) {
        //Check that all the assets have been deposited, and return the quantity missing    
        Deal memory deal = getDeal(id);
        if (deal.status == DealStatus.Settled) {
            return 777;
        }
        uint256 assetDeposits = 0;
        for (uint i = 0; i < deal.assetItems.length; i ++) {
            // Check that I (the dealroom contract) own this asset
            if (deal.erc721.ownerOf(deal.assetItems[i]) == address(this)) {
                assetDeposits ++;
            }
        }
        return assetDeposits;
    }

    function missingDealCoins(
        uint256 id
    ) public view dealExists(id, true) returns (uint256) {
        //Check that all the coins have been deposited, and return the amount missing
        Deal memory deal = getDeal(id);
        /*if (deal.status == DealStatus.Settled) {
            return 0;
        }*/
        uint256 balance = deal.erc20.balanceOf(address(this));
        if (balance >= deal.price) {
            return 0;
        }
        return deal.price - balance;
    }

    function settle(
        uint256 id
    ) public dealOpen(id) isOwner() {
        //Deal deal = getDeal(id)
        //emit Debug("Deal ID", deal.id);
        //emit Debug("Deal ID", deal.id);

        //uint missing = missingDealAssets(id);
        require(missingDealAssets(id) == 0, "DEAL_ASSETS_MISSING");
        require(missingDealCoins(id) == 0, "DEAL_TOKENS_MISSING");
        //emit Debug("Missing deal assets", missing);
        _setDealStatus(id, DealStatus.Settled);
    }

    function _setDealStatus(
        uint256 id,
        DealStatus status
    ) private dealExists(id, true) {
        deals[id].status = status;
    }

    //Transfer a batch of assets
    function withdrawDealAssets(uint256 dealId, uint256 count) public dealExists(dealId, true) {
        Deal memory deal = getDeal(dealId);
        uint256 transferred = 0;

        if (deal.status == DealStatus.Settled) {
            require(msg.sender == buyer, "BUYER_ONLY");
        } else {
            require(msg.sender == seller, "SELLER_ONLY");
        }

        for (uint i = 0; i < deal.assetItems.length; i ++) {
            if (transferred < count && deal.erc721.ownerOf(deal.assetItems[i]) == address(this)) {
                deal.erc721.transferFrom(address(this), msg.sender, deal.assetItems[i]);
                transferred ++;
            }
        }
    }

    function withdrawDealCoins(uint256 dealId) public dealExists(dealId, true) {
        Deal memory deal = getDeal(dealId);

        if (deal.status == DealStatus.Settled) {
            require(msg.sender == seller, "SELLER_ONLY");
        } else {
            require(msg.sender == buyer, "BUYER_ONLY");
        }
        //TODO: Only allow the withdrawal once
        deal.erc20.transfer(msg.sender, deal.price);
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

    function getDeal(
        uint256 id
    ) public view returns (Deal memory) {
        return deals[id];
    }

    function getDealCount() public view returns (uint256) {
        return dealCount;
    }

    function getDealStatus(
        uint256 id
    ) public view dealExists(id, true) returns (DealStatus)  {
        Deal memory deal = getDeal(id);
        return deal.status;
    }

    modifier dealExists(
        uint256 id,
        bool exists
    ) {
        Deal memory deal = getDeal(id);
        require(deal.valid == exists, exists?"DEAL_NOT_FOUND":"DEAL_EXISTS");
        _;
    }

    modifier dealOpen(
        uint256 id
    ) {
        Deal memory deal = getDeal(id);
        require(deal.status == DealStatus.Open, "DEAL_NOT_OPEN");
        _;
    }

    modifier dealClosed(
        uint256 id
    ) {
        Deal memory deal = getDeal(id);
        require(deal.status != DealStatus.Open, "DEAL_OPEN");
        _;
    }

    modifier isOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }
}
