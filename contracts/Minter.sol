/*
Published at:
0xAfb1ae4D14e842CacFE44c1911a0b4542D54595c
*/

pragma solidity ^0.4.11;

import "./ProsperaToken.sol";
import "./Owned.sol";

contract Minter is Owned {

  uint256 public lastMintingTime = 0;
  uint256 public lastMintingAmount;
  address public prosperaTokenAddress;
  ProsperaToken public prosperaToken;

  modifier allowedMinting() {
    if (block.timestamp >= lastMintingTime + 30 days) {
      _;
    }
  }

  function Minter (uint256 _lastMintingAmount, address _ownerContract) {
    lastMintingAmount = _lastMintingAmount;
    prosperaTokenAddress = _ownerContract;
    prosperaToken = ProsperaToken(_ownerContract);
  }

  // increases 2.95% from last minting
  // TODO: add constant modifier
  function calculateMintAmount() returns (uint256 amount){
   return lastMintingAmount * 10295 / 10000;
  }

  function updateMintingStatus(uint256 _mintedAmount) internal {
    lastMintingAmount = _mintedAmount;
    lastMintingTime = block.timestamp;
    prosperaToken.incrementTotalSupply(_mintedAmount);
  }

  function mint() allowedMinting onlyOwner returns (bool success) {
    uint256 value = calculateMintAmount();
    prosperaToken.mintToAccount(msg.sender, value);
    updateMintingStatus(value);
    return true;
  }
}
