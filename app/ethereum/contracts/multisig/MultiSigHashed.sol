pragma solidity ^0.5.0;

import "./MultiSigWallet.sol";

contract MultiSigHashed is MultiSigWallet {

    //This structure is needed to deal with the case where the transaction ID is 0
    struct TransactionHash {
        uint256 id;
        bool hashed;
    }

    event SubmissionHashed(bytes32 indexed hash);

    mapping (bytes32 => TransactionHash) public transactionHashes;

    constructor(address[] memory _owners, uint256 _required) MultiSigWallet(_owners, _required) public validRequirement(_owners.length, _required) {

    }

    function getExistingTransaction(address destination, uint256 value, bytes memory data) public
        notNull(destination) returns (uint256 transactionId) {
        bytes32 hash = _toHash(destination, value, data);
        TransactionHash memory existingTransactionHash  = transactionHashes[hash];
        require(existingTransactionHash.hashed, "Transaction does not exist");
        return existingTransactionHash.id;
    }

    function submitTransaction(address destination, uint256 value, bytes memory data) public 
        notNull(destination) returns (uint256 transactionId)
    {
        bytes32 hash = _toHash(destination, value, data);
        TransactionHash memory existingTransactionHash  = transactionHashes[hash];
        if (existingTransactionHash.hashed) {
            super.confirmTransaction(existingTransactionHash.id);
            emit SubmissionHashed(hash);
            return existingTransactionHash.id;
        } 
        else {
            transactionId = super.submitTransaction(destination, value, data);
            transactionHashes[hash] = TransactionHash(
                transactionId,
                true
            );
            emit SubmissionHashed(hash);
        }
        return transactionId;
    }

    function _toHash(address destination, uint256 value, bytes memory data) internal returns (bytes32) {
        return keccak256(abi.encodePacked(destination, value, data));
    }

}