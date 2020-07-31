pragma solidity >=0.5.0 <0.7.0;
pragma experimental ABIEncoderV2;

import "./ERC721/IERC721Full.sol";
import "./ERC20/IERC20.sol";

/// @title DealRoom -- allows atomic swap for ERC20/ERC721
/// @author Barry Earsman
contract DealRoom {
    address owner;
    IERC721Full public erc721;
    IERC20 public erc20;
    uint256 public dealCount;
    mapping(uint256 => Deal) private deals;
    uint256[] private dealIds;
    bool private settled;
    address buyer;
    address seller;

    struct Deal {
        uint256 id;
        IERC20 erc20;
        IERC721Full erc721;
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

    constructor (address _buyer, address _seller) public {
        buyer = _buyer;
        seller = _seller;
        dealCount = 0;
        owner = msg.sender;
    }

    function makeDeal(
        uint256 _id,
        IERC20 _erc20,
        IERC721Full _erc721,
        uint256 _price,
        uint256[] memory _assetItems
    ) public dealExists(_id, false) {

        deals[_id] = Deal({
            id: _id,
            erc721: _erc721,
            erc20: _erc20,
            price: _price,
            assetItems: _assetItems,
            status: DealStatus.Open,
            valid: true
        });
        dealIds.push(_id);
    }

    function missingDealAssets(
        uint256 id
    ) public view dealOpen(id) returns (uint256) {
        //Check that all the assets have been deposited, and return the quantity missing
        uint256 assetDeposits = 0;
        Deal memory deal = getDeal(id);

        for (uint i = 0; i < deal.assetItems.length; i ++) {
            // Check that I own this asset
            if (deal.erc721.ownerOf(deal.assetItems[i]) == address(this)) {
                assetDeposits ++;
            }
        }
        return (deal.assetItems.length - assetDeposits);
    }

    function missingDealTokens(
        uint256 id
    ) public view dealOpen(id) returns (uint256) {
        //Check that all the tokens have been deposited, and return the amount missing
        Deal memory deal = getDeal(id);
        return deal.price - deal.erc20.balanceOf(address(this));
    }

    function settle(
        uint256 id
    ) public dealOpen(id) isOwner() {
        require(missingDealAssets(id) == 0, "DEAL_ASSETS_MISSING");
        require(missingDealTokens(id) == 0, "DEAL_TOKENS_MISSING");
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

    function withdrawDealTokens(uint256 dealId) public dealExists(dealId, true) {
        Deal memory deal = getDeal(dealId);

        if (deal.status == DealStatus.Settled) {
            require(msg.sender == seller, "BUYER_ONLY");
        } else {
            require(msg.sender == buyer, "SELLER_ONLY");
        }
        deal.erc20.transfer(msg.sender, deal.price);
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    function changeOwner(address newOwner) public isOwner() {
        owner = newOwner;
    }

    function getDeal(
        uint256 id
    ) public view returns (Deal memory) {
        return deals[id];
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
