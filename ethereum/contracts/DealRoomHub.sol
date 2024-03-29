// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity ^0.8.0;

import "./DealRoom.sol";
import "./multisig/MultiSigHashed.sol";

contract DealRoomHub {
    address owner;

    struct DealRoomDetails {
        address addr;
        address buyer;
        address seller;
        address arbitrator;
        address sensorApprover;
        address docApprover;
        address dealMultiSig;
        address agentMultiSig;
    }

    mapping (address => address[]) private roomsByUser;
    mapping (address => DealRoomDetails) private roomDetailsByAddress;

    address[] private rooms;

    struct MakeRoomParams {
        address buyer;
        address seller;
        address arbitrator;
        address sensorApprover;
        address docApprover;
    }

    event NewRoomEvent(
        address addr
    );

    function makeBasicRoom(address buyer, address seller) public returns (address) {
        DealRoom room = new DealRoom(buyer, seller);
        require(buyer != address(0), "BUYER_MISSING");
        require(seller != address(0), "SELLER_MISSING");   

        //Make a Main multisig, 2/2 with Agents
        address[] memory mainSignatories = new address[](2);
        mainSignatories[0] = buyer;
        mainSignatories[1] = seller; 
        MultiSigHashed dealMultiSig = new MultiSigHashed(mainSignatories, 2);   

        //Give the room to the Multisig
        room.changeOwner(address(dealMultiSig));

        //===Record room details (without upsetting the compiler)
        //Add to list
        rooms.push(address(room));
        //Index by buyer and seller
        roomsByUser[buyer].push(address(room));
        roomsByUser[seller].push(address(room));

        //Index by address
        roomDetailsByAddress[address(room)].addr = address(room);
        roomDetailsByAddress[address(room)].buyer = buyer;
        roomDetailsByAddress[address(room)].seller = seller;
        roomDetailsByAddress[address(room)].dealMultiSig = address(dealMultiSig);

        emit NewRoomEvent(address(room));

        return address(room);
    }

    // Combine two transactions into one
    // Make a basic room, then create a deal
    function makeBasicRoomAndDeal(
        address buyer,
        address seller,
        IERC20 _erc20,
        IERC721 _erc721,
        uint256 _price,
        uint256[] memory _assetItems
    ) public returns (address) {
        address addr = makeBasicRoom(buyer, seller);
        DealRoom room = DealRoom(addr);
        room.makeDeal(_erc20, _erc721, _price, _assetItems);
        return addr;
    }

    function makeRoom(MakeRoomParams memory params) public returns (address) {
        DealRoom room = new DealRoom(params.buyer, params.seller);
        require(params.buyer != address(0), "BUYER_MISSING");
        require(params.seller != address(0), "SELLER_MISSING");
        require(params.arbitrator != address(0), "ARBITRATOR_MISSING");
        require(params.sensorApprover != address(0), "SENSOR_APPROVER_MISSING");
        require(params.docApprover != address(0), "DOC_APPROVER_MISSING");

        //Make an Agents multisig, 2/3 with Buyer, Seller, Arbitrator
        address[] memory agents = new address[](3);
        agents[0] = params.buyer;
        agents[1] = params.seller;
        agents[2] = params.arbitrator; 
        MultiSigHashed agentMultiSig = new MultiSigHashed(agents, 2);
        
        //Make a Main multisig, 3/3 with Agents, DocApprover, SensorApprover
        address[] memory mainSignatories = new address[](3);
        mainSignatories[0] = params.sensorApprover;
        mainSignatories[1] = params.docApprover; 
        mainSignatories[2] = address(agentMultiSig);  
        MultiSigHashed dealMultiSig = new MultiSigHashed(mainSignatories, 3);
        
        //Give the room to the Main Multisig
        room.changeOwner(address(dealMultiSig));

        //===Record room details (without upsetting the compiler)
        //Add to list
        rooms.push(address(room));
        //Index by buyer and seller
        roomsByUser[params.buyer].push(address(room));
        roomsByUser[params.seller].push(address(room));
        roomsByUser[params.arbitrator].push(address(room));
        roomsByUser[params.sensorApprover].push(address(room));
        roomsByUser[params.docApprover].push(address(room));

        //Index by address
        roomDetailsByAddress[address(room)].addr = address(room);
        roomDetailsByAddress[address(room)].buyer = params.buyer;
        roomDetailsByAddress[address(room)].seller = params.seller;
        roomDetailsByAddress[address(room)].arbitrator = params.arbitrator;        
        roomDetailsByAddress[address(room)].sensorApprover = params.sensorApprover;
        roomDetailsByAddress[address(room)].docApprover = params.docApprover;
        roomDetailsByAddress[address(room)].dealMultiSig = address(dealMultiSig);
        roomDetailsByAddress[address(room)].agentMultiSig = address(agentMultiSig);

        emit NewRoomEvent(address(room));

        return address(room);
    }

    function getUserRooms(address _user) public view returns(address[] memory) {
        return roomsByUser[_user];
    }
    function getAllRooms() public view returns(address[] memory) {
        return rooms;
    }
    function getRoom(address addr) public view returns (DealRoomDetails memory) {
        return roomDetailsByAddress[addr];
    }
    function roomCount() public view returns (uint) {
        return rooms.length;
    }

    modifier roomExists(
        address addr,
        bool mustExist
    ) {
        DealRoomDetails memory roomDetails = getRoom(addr);
        if (mustExist) {
            //Room must exist
            require(roomDetails.addr != address(0), "ROOM_NOT_FOUND");
        } else {
            //Room must not already exist
            require(roomDetails.addr == address(0), "ROOM_EXISTS");
        }
        _;
    }

    function changeOwner(address newOwner) public isOwner() {
        owner = newOwner;
    }

    modifier isOwner() {
        require(msg.sender == owner, "ONLY_OWNER");
        _;
    }
}
