/*
Published at:
1. 0xAfb1ae4D14e842CacFE44c1911a0b4542D54595c
2. 0xab705e15925d411dafc5927b7803c9da54e50334
*/

pragma solidity ^0.4.11;

import "./ProsperaToken.sol";
import "./Owned.sol";

contract Minter is Owned {

  uint256 public lastMintingTime = 0;
  uint256 public lastMintingAmount;
  ProsperaToken public prosperaToken;

  modifier allowedMinting() {
    if (block.timestamp >= lastMintingTime + 30 days) {
      _;
    }
  }

  function Minter (uint256 _lastMintingAmount, address _ownerContract) public {
    lastMintingAmount = _lastMintingAmount;
    prosperaToken = ProsperaToken(_ownerContract);
  }

  // increases 2.95% from last minting
  function calculateMintAmount() public view returns (uint256 amount){
   return lastMintingAmount * 10295 / 10000;
  }

  function updateMintingStatus(uint256 _mintedAmount) internal {
    lastMintingAmount = _mintedAmount;
    lastMintingTime = block.timestamp;
    prosperaToken.incrementTotalSupply(_mintedAmount);
  }

  function mint() onlyOwner public returns (bool success) {
    uint256 value = calculateMintAmount();
    prosperaToken.mintToAccount(msg.sender, value);
    updateMintingStatus(value);
    return true;
  }
}