pragma solidity ^0.4.11;

contract Owned {
    address public owner;

    function Owned() {
        owner = msg.sender;
    }

    modifier onlyOwner {
        if (msg.sender != owner) throw;
        _;
    }

    function transferOwnership(address newOwner) onlyOwner returns (address owner) {
        if (newOwner == 0x0) throw;
        owner = newOwner;
        return owner;
    }
}
