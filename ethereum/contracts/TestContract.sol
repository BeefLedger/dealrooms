pragma solidity >=0.5.0 <0.8.0;

contract TestContract {

    uint256 intValue;

    function doSomethingInt(uint256 _intValue) public {
        intValue = _intValue;
    }

    function getSomethingInt() public view returns (uint256) {
        return intValue;
    }
}