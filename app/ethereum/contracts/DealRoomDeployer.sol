// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.7.0;

import "./DealRoom.sol";

contract DealRoomDeployer {

    mapping (address => address[]) private roomsByUser;
    mapping (uint256 => address) private roomById;
    address[] private rooms;

    function makeRoom(uint256 id, address buyer, address seller) public roomExists(id, false) {
        DealRoom room = new DealRoom(buyer, seller);
        room.changeOwner(msg.sender);
        rooms.push(address(room));
        roomsByUser[buyer].push(address(room));
        roomsByUser[seller].push(address(room));
        roomById[id] = address(room);
    }

    function getUserRooms(address _user) public view returns(address[] memory) {
        return roomsByUser[_user];
    }
    function getAllRooms() public view returns(address[] memory) {
        return rooms;
    }
    function getRoom(uint256 id) public view returns (address) {
        return roomById[id];
    }
    function roomCount() public view returns (uint) {
        return rooms.length;
    }

    modifier roomExists(
        uint256 id,
        bool mustExist
    ) {
        address roomAddr = getRoom(id);
        if (mustExist) {
            //Room must exist
            require(roomAddr != address(0), "ROOM_NOT_FOUND");
        } else {
            //Room must not already exist
            require(roomAddr == address(0), "ROOM_EXISTS");
        }
        _;
    }
}
