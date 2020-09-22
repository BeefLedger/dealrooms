// SPDX-License-Identifier: MIT
pragma experimental ABIEncoderV2;
pragma solidity ^0.5.0;

import "./DealRoom.sol";
import "./multisig/MultiSigWallet.sol";

contract DealRoomDeployer {

    struct DealRoomDetails {
        address room;
        address buyer;
        address seller;
        address arbitrator;
        address sensorApprover;
        address docApprover;
        address mainMultiSig;
        address agentsMultiSig;
    }

    mapping (address => address[]) private roomsByUser;
    mapping (uint32 => DealRoomDetails) private roomDetailsById;

    address[] private rooms;

    struct MakeRoomParams {
        uint32 id;
        address buyer;
        address seller;
        address arbitrator;
        address sensorApprover;
        address docApprover;
    }

    function makeRoom(MakeRoomParams memory params) public roomExists(params.id, false) {
        DealRoom room = new DealRoom(params.buyer, params.seller);
        
        address[] memory agents = new address[](3);
        agents[0] = params.buyer;
        agents[1] = params.seller;
        agents[2] = params.arbitrator;
        MultiSigWallet agentsMultiSig = new MultiSigWallet(agents, 2);
        
        address[] memory mainSignatories = new address[](3);
        agents[0] = address(agentsMultiSig);
        agents[1] = params.sensorApprover;
        agents[2] = params.docApprover;    
        MultiSigWallet mainMultiSig = new MultiSigWallet(mainSignatories, 3);
        
        room.changeOwner(address(mainMultiSig));

        rooms.push(address(room));
        roomsByUser[params.buyer].push(address(room));
        roomsByUser[params.seller].push(address(room));
        
        roomDetailsById[params.id].room = address(room);
        roomDetailsById[params.id].buyer = params.buyer;
        roomDetailsById[params.id].seller = params.seller;
        roomDetailsById[params.id].arbitrator = params.arbitrator;        
        roomDetailsById[params.id].sensorApprover = params.sensorApprover;
        roomDetailsById[params.id].docApprover = params.docApprover;
        roomDetailsById[params.id].mainMultiSig = address(mainMultiSig);
        roomDetailsById[params.id].agentsMultiSig = address(agentsMultiSig);
    }

    function getUserRooms(address _user) public view returns(address[] memory) {
        return roomsByUser[_user];
    }
    function getAllRooms() public view returns(address[] memory) {
        return rooms;
    }
    function getRoom(uint32 id) public view returns (DealRoomDetails memory) {
        return roomDetailsById[id];
    }
    function roomCount() public view returns (uint) {
        return rooms.length;
    }

    modifier roomExists(
        uint32 id,
        bool mustExist
    ) {
        DealRoomDetails memory roomDetails = getRoom(id);
        if (mustExist) {
            //Room must exist
            require(roomDetails.room != address(0), "ROOM_NOT_FOUND");
        } else {
            //Room must not already exist
            require(roomDetails.room == address(0), "ROOM_EXISTS");
        }
        _;
    }
}
