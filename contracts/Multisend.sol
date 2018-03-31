// Publicado em: 0x376F0eB80530AB03bE79d34eA2f65EFEE8Bf4e69

pragma solidity ^0.4.16;

contract Multisend {
    mapping(address => uint) public nonces;
    address creator;

    function Multisend () {
        creator = msg.sender;
    }

    function send(address[] addrs, uint[] amounts, uint nonce) payable public {
        require(addrs.length == amounts.length && nonce == nonces[msg.sender]);
        uint val = msg.value;

        for(uint i = 0; i<addrs.length; i++){
            require(val >= amounts[i]);
            if(addrs[i].send(amounts[i])){
                val -= amounts[i];
            }
        }
        msg.sender.transfer(val);
        nonces[msg.sender]++;
    }
}
