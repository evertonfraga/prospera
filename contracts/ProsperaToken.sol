/*
Published at:
0x0c04d4f331da8df75f9e2e271e3f3f1494c66c36

This Token Contract implements the standard token functionality (https://github.com/ethereum/EIPs/issues/20) as well as the following OPTIONAL extras intended for use by humans.

In other words. This is intended for deployment in something like a Token Factory or Mist wallet, and then used by humans.
Imagine coins, currencies, shares, voting weight, etc.
Machine-based, rapid creation of many tokens would not necessarily need these extra features or will be minted in other manners.

1) Initial Finite Supply (upon creation one specifies how much is minted).
2) In the absence of a token registry: Optional Decimal, Symbol & Name.
3) Optional approveAndCall() functionality to notify a contract if an approval() has occurred.

.*/

import "./StandardToken.sol";
import "./Owned.sol";

pragma solidity ^0.4.11;

contract ProsperaToken is StandardToken, Owned {

    function () {
        //if ether is sent to this address, send it back.
        throw;
    }

    /* Public variables of the token */

    /*
    NOTE:
    The following variables are OPTIONAL vanities. One does not have to include them.
    They allow one to customise the token contract & in no way influences the core functionality.
    Some wallets/interfaces might not even bother to look at this information.
    */
    string public name;                   //fancy name: eg Simon Bucks
    uint8 public decimals;                //How many decimals to show. ie. There could 1000 base units with 3 decimals. Meaning 0.980 SBX = 980 base units. It's like comparing 1 wei to 1 ether.
    string public symbol;                 //An identifier: eg SBX
    string public version = '0.1';       //human 0.1 standard. Just an arbitrary versioning scheme.


    function ProsperaToken(
        uint256 _initialAmount,
        string _tokenName,
        uint8 _decimalUnits,
        string _tokenSymbol
        ) {
        balances[msg.sender] = _initialAmount;               // Give the creator all initial tokens
        totalSupply = _initialAmount;                        // Update total supply
        name = _tokenName;                                   // Set the name for display purposes
        decimals = _decimalUnits;                            // Amount of decimals for display purposes
        symbol = _tokenSymbol;                               // Set the symbol for display purposes
    }

    /* Approves and then calls the receiving contract */
    function approveAndCall(address _spender, uint256 _value, bytes _extraData) returns (bool success) {
        allowed[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);

        //call the receiveApproval function on the contract you want to be notified. This crafts the function signature manually so one doesn't have to include a contract in here just for this.
        //receiveApproval(address _from, uint256 _value, address _tokenContract, bytes _extraData)
        //it is assumed that when does this that the call *should* succeed, otherwise one would use vanilla approve instead.
        if(!_spender.call(bytes4(bytes32(sha3("receiveApproval(address,uint256,address,bytes)"))), msg.sender, _value, this, _extraData)) { throw; }
        return true;
    }


    /* Batch token transfer. Used by contract creator to distribute initial coins to holders */
    function batchTransfer(address[] _recipients, uint256[] _values) returns (bool success) {
      if ((_recipients.length == 0) || (_recipients.length != _values.length)) throw;

      for(uint8 i = 0; i < _recipients.length; i += 1) {
        if (!transfer(_recipients[i], _values[i])) throw;
      }
      return true;
    }



    address minterContract;
    event Mint(address indexed _account, uint256 _amount);
    
    modifier onlyMinter {
        if (msg.sender != minterContract) throw;
         _;
    }

    function setMinter (address newMinter) onlyOwner returns (bool success) {
      minterContract = newMinter;
      return true;
    }

    function mintToAccount(address _account, uint256 _amount) onlyMinter returns (bool success) {
        // Checks for variable overflow
        if (balances[_account] + _amount < balances[_account]) throw;
        balances[_account] += _amount;
        Mint(_account, _amount);
        return true;
    }

    function incrementTotalSupply(uint256 _incrementValue) onlyMinter returns (bool success) {
        totalSupply += _incrementValue;
        return true;
    }

}
