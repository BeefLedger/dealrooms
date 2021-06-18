// SPDX-License-Identifier: LGPLv3
pragma solidity ^0.8.0;

/// @title Multisignature wallet - Allows multiple parties to agree on transactions before execution.
/// @author Stefan George - <stefan.george@consensys.net>
contract MultiSigHashed {

    /*
     *  Events
     */
    event Confirmation(address indexed sender, bytes32 indexed hash);
    event Revocation(address indexed sender, bytes32 indexed hash);
    event Submission(bytes32 indexed hash);
    event Execution(bytes32 indexed hash);
    event ExecutionFailure(bytes32 indexed hash);
    event Deposit(address indexed sender, uint256 value);
    event OwnerAddition(address indexed owner);
    event OwnerRemoval(address indexed owner);
    event RequirementChange(uint256 required);

    /*
     *  Constants
     */
    uint256 constant public MAX_OWNER_COUNT = 50;

    /*
     *  Storage
     */
    mapping (bytes32 => Transaction) public transactions;
    mapping (bytes32 => mapping (address => bool)) public confirmations;
    mapping (address => bool) public isOwner;
    mapping (uint256 => bytes32) public hashes;
    address[] public owners;
    uint256 public required;
    uint256 public transactionCount;

    struct Transaction {
        address destination;
        uint256 value;
        bytes data;
        bool executed;
        uint256 timestamp;
        bytes32 hash;
    }

    /*
     *  Modifiers
     */
    modifier onlyWallet() {
        require(msg.sender == address(this), "Only wallet");
        _;
    }

    modifier ownerDoesNotExist(address owner) {
        require(!isOwner[owner], "Owner exists");
        _;
    }

    modifier ownerExists(address owner) {
        require(isOwner[owner], "Owner does not exist");
        _;
    }

    modifier transactionExists(bytes32 hash) {
        require(_transactionExists(hash), "Tx doesn't exist");
        _;
    }

    modifier confirmed(bytes32 hash, address owner) {
        require(confirmations[hash][owner], ": not confirmed");
        _;
    }

    modifier notConfirmed(bytes32 hash, address owner) {
        require(!confirmations[hash][owner], ": is already confirmed");
        _;
    }

    function ownerHasConfirmed(bytes32 hash, address owner) public view returns (bool) {
        return confirmations[hash][owner];
    }

    modifier notExecuted(bytes32 hash) {
        require(!transactions[hash].executed, ": tx already executed");
        _;
    }

    modifier notNull(address _address) {
        require(_address != address(0), ": address is null");
        _;
    }

    modifier validRequirement(uint256 ownerCount, uint256 _required) {
        require(ownerCount <= MAX_OWNER_COUNT && _required <= ownerCount && _required != 0 && ownerCount != 0, "invalid requirement");
        _;
    }

    /// @dev Fallback function allows to deposit ether.
    fallback() external payable {
        if (msg.value > 0)
            emit Deposit(msg.sender, msg.value);
    }

    // @dev Explicitly defined function for receiving ether.
    receive() external payable {
        if (msg.value > 0)
            emit Deposit(msg.sender, msg.value);
    }

    /*
     * Public functions
     */
    /// @dev Contract constructor sets initial owners and required number of confirmations.
    /// @param _owners List of initial owners.
    /// @param _required Number of required confirmations.
    constructor(address[] memory _owners, uint256 _required) validRequirement(_owners.length, _required) {
        for (uint256 i = 0; i < _owners.length; i++) {
            require(!isOwner[_owners[i]], "is already owner");
            require(_owners[i] != address(0), "is null address");
            isOwner[_owners[i]] = true;
        }
        owners = _owners;
        required = _required;
    }

    /// @dev Allows to add a new owner. Transaction has to be sent by wallet.
    /// @param owner Address of new owner to add.
    function addOwner(address owner)  public
        onlyWallet
        ownerDoesNotExist(owner)
        notNull(owner)
        validRequirement(owners.length + 1, required)
    {
        isOwner[owner] = true;
        owners.push(owner);
        emit OwnerAddition(owner);
    }

    /// @dev Allows to remove an owner. Transaction has to be sent by wallet.
    /// @param owner Address of owner to remove.
    function removeOwner(address owner) public onlyWallet ownerExists(owner) {
        isOwner[owner] = false;
        for (uint256 i = 0; i < owners.length - 1; i++){
            if (owners[i] == owner) {
                owners[i] = owners[owners.length - 1];
                break;
            }
        }
        owners.pop();
        if (required > owners.length)
            changeRequirement(owners.length);
        emit OwnerRemoval(owner);
    }

    /// @dev Allows to replace an owner with a new owner. Transaction has to be sent by wallet.
    /// @param owner Address of owner to be replaced.
    /// @param newOwner Address of new owner.
    function replaceOwner(address owner, address newOwner) public onlyWallet ownerExists(owner) ownerDoesNotExist(newOwner) {
        for(uint256 i = 0; i < owners.length; i++) {
            if (owners[i] == owner) {
                owners[i] = newOwner;
                break;
            }
        }
        isOwner[owner] = false;
        isOwner[newOwner] = true;
        emit OwnerRemoval(owner);
        emit OwnerAddition(newOwner);
    }

    /// @dev Allows to change the number of required confirmations. Transaction has to be sent by wallet.
    /// @param _required Number of required confirmations.
    function changeRequirement(uint256 _required) public onlyWallet validRequirement(owners.length, _required) {
        required = _required;
        emit RequirementChange(_required);
    }

    /// @dev Allows an owner to submit and confirm a transaction.
    /// @param destination Transaction target address.
    /// @param value Transaction ether value.
    /// @param data Transaction data payload.
    /// @return hash representing transaction ID.
    function submitTransaction(address destination, uint256 value, bytes memory data) public returns (bytes32 hash) {
        return addTransaction(destination, value, data);
        //confirmTransaction(hash);
    }

    /// @dev Allows an owner to confirm a transaction.
    /// @param hash Transaction ID.
    function confirmTransaction(bytes32 hash) public
        ownerExists(msg.sender)
        transactionExists(hash)
        notConfirmed(hash, msg.sender)
    {
        confirmations[hash][msg.sender] = true;
        emit Confirmation(msg.sender, hash);
        executeTransaction(hash);
    }

    /// @dev Allows an owner to revoke a confirmation for a transaction.
    /// @param hash Transaction ID.
    function revokeConfirmation(bytes32 hash) public
        ownerExists(msg.sender)
        confirmed(hash, msg.sender)
        notExecuted(hash)
    {
        confirmations[hash][msg.sender] = false;
        emit Revocation(msg.sender, hash);
    }

    /// @dev Allows anyone to execute a confirmed transaction.
    /// @param hash Transaction ID.
    function executeTransaction(bytes32 hash) public
        ownerExists(msg.sender)
        confirmed(hash, msg.sender)
        notExecuted(hash)
    {
        if (isConfirmed(hash)) {
            Transaction storage txn = transactions[hash];
            txn.executed = true;
            if (external_call(txn.destination, txn.value, txn.data.length, txn.data))
                emit Execution(hash);
            else {
                emit ExecutionFailure(hash);
                txn.executed = false;
            }
        }
    }

    // call has been separated into its own function in order to take advantage
    // of the Solidity's code generator to produce a loop that copies tx.data into memory.
    function external_call(address destination, uint256 value, uint256 dataLength, bytes memory data) internal returns (bool) {
        bool result;
        assembly {
            let x := mload(0x40)   // "Allocate" memory for output (0x40 is where "free memory" pointer is stored by convention)
            let d := add(data, 32) // First 32 bytes are the padded length of data, so exclude that
            result := call(sub(gas(), 34710),   // 34710 is the value that solidity is currently emitting
                                   // It includes callGas (700) + callVeryLow (3, to pay for SUB) + callValueTransferGas (9000) +
                                   // callNewAccountGas (25000, in case the destination address does not exist and needs creating)
                destination,
                value,
                d,
                dataLength,        // Size of the input (in bytes) - this is what fixes the padding problem
                x,
                0                  // Output is ignored, therefore the output size is zero
            )
        }
        return result;
    }

    /// @dev Returns the confirmation status of a transaction.
    /// @param hash Transaction ID.
    /// @return Confirmation status.
    function isConfirmed(bytes32 hash) public view returns (bool) {
        uint256 count = 0;
        for (uint256 i = 0; i < owners.length; i++) {
            if (confirmations[hash][owners[i]])
                count += 1;
            if (count == required)
                return true;
        }
    }

    /*
     * Internal functions
     */
    /// @dev Adds a new transaction to the transaction mapping, if transaction does not exist yet.
    /// @param destination Transaction target address.
    /// @param value Transaction ether value.
    /// @param data Transaction data payload.
    function addTransaction(address destination, uint256 value, bytes memory data) internal
        notNull(destination) returns (bytes32 hash) {
        hash = _toHash(destination, value, data);
        if (!_transactionExists(hash)) {
            transactions[hash] = Transaction({
                hash: hash,
                destination: destination,
                value: value,
                data: data,
                executed: false,
                timestamp: block.timestamp
            });
            hashes[transactionCount] = hash;
            transactionCount += 1;
            confirmTransaction(hash);
            emit Submission(hash);
        } else {
            confirmTransaction(hash);
        }
    }

    function makeHash(address destination, uint256 value, bytes memory data) public pure returns (bytes32 hash) {
        return _toHash(destination, value, data);
    }

    /*
     * Web3 call functions
     */
    /// @dev Returns number of confirmations of a transaction.
    /// @param hash Transaction ID.
    /// @return count of confirmations.
    function getConfirmationCount(bytes32 hash) public view returns (uint256 count) {
        for (uint256 i = 0; i < owners.length; i++) {
            if (confirmations[hash][owners[i]])  count += 1;
        }
    }

    /// @dev Returns list of owners.
    /// @return address list of owner addresses.
    function getOwners() public view returns (address[] memory) {
        return owners;
    }

    /// @dev Returns array with owner addresses, which confirmed transaction.
    /// @param hash Transaction ID.
    function getConfirmations(bytes32 hash) public view returns (address[] memory _confirmations) {
        address[] memory confirmationsTemp = new address[](owners.length);
        uint256 count = 0;
        uint256 i;
        for (i = 0; i < owners.length; i++) {
            if (confirmations[hash][owners[i]]) {
                confirmationsTemp[count] = owners[i];
                count += 1;
            }
        }
        _confirmations = new address[](count);
        for (i = 0; i < count; i++) {
            _confirmations[i] = confirmationsTemp[i];
        }
    }

    function getTransaction(bytes32 hash) public view returns (bytes32, bytes memory, address, bool, uint256) {
        Transaction memory txn = transactions[hash];
        return (
            hash,
            txn.data,
            txn.destination,
            txn.executed,
            txn.timestamp
        );
    }

    function getTransactionByIdx(uint256 idx) public view returns (bytes32, bytes memory, address, bool, uint256)  {
        Transaction memory txn = transactions[hashes[idx]];
        return (
            txn.hash,
            txn.data,
            txn.destination,
            txn.executed,
            txn.timestamp
        );
    }

    function _toHash(address destination, uint256 value, bytes memory data) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(destination, value, data));
    }

    function _transactionExists(bytes32 hash) internal view returns (bool exists) {
        return (transactions[hash].destination != address(0));
    }

    
}
