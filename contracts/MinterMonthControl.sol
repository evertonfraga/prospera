/*
Published at:
0xAfb1ae4D14e842CacFE44c1911a0b4542D54595c
*/

pragma solidity ^0.4.16;

import "./ProsperaToken.sol";
import "./Owned.sol";
import "./DateTime.sol";

pragma solidity ^0.4.16;


/* constructor params
"0x08970fed061e7747cd9a38d680a601510cb659fb", 36139470081, "0x9dd1e8169e76a9226b07ab9f85cc20a5e1ed44dd"
*/
contract Minter is Owned {

  ProsperaToken public prosperaToken;
  DateTime public dateTimeContract;

  uint256 public lastMintingAmount;
  uint256 public lastMintingPeriod = 0;
  
  uint256 public startingYear;
  uint256 public startingMonth;

  function Minter (address _ownerContract,
                   uint256 _lastMintingAmount,
                   address _dateTimeContract) public {
    prosperaToken = ProsperaToken(_ownerContract);
    lastMintingAmount = _lastMintingAmount;
    dateTimeContract = DateTime(_dateTimeContract);
    
    startingYear = dateTimeContract.getYear(block.timestamp);
    startingMonth = dateTimeContract.getMonth(block.timestamp);
  }

    
  modifier allowedMinting() {
/*    if (block.timestamp >= lastMintingTime + 30 days) {
      _;
    }*/
    _;
  }

  function currentDateToPeriod(uint256 timestamp) public view returns (uint) {
    require(timestamp > 0);
    uint16 year = dateTimeContract.getYear(timestamp);
    uint8 month = dateTimeContract.getMonth(timestamp);
    return (year - startingYear) * 12 + month;
  }

  // increases 2.95% from last minting
  function calculateMintAmount() public view returns (uint256 amount){
   return lastMintingAmount * 10295 / 10000;
  }

  function mint() allowedMinting onlyOwner public returns (bool success) {
    uint256 value = calculateMintAmount();

    prosperaToken.mintToAccount(msg.sender, value);
    prosperaToken.incrementTotalSupply(value);  

    lastMintingAmount = value;
    lastMintingPeriod++;

    return true;
  }
}
