pragma solidity ^0.4.11;

import "./ProsperaToken.sol";

contract Minter {

  uint256 lastMintingTime = 0;
  uint256 lastMintingAmount;
  address prosperaTokenAddress;
  ProsperaToken prosperaToken;

  modifier allowedMinting() {
    if (block.timestamp >= lastMintingTime + 30 days) {
      _;
    }
  }

  modifier onlyOwnerContract {
    if (msg.sender != prosperaTokenAddress) throw;
    _;
  }

  function Minter (uint256 _lastMintingAmount, address _ownerContract) {
    lastMintingAmount = _lastMintingAmount;
    prosperaTokenAddress = _ownerContract;
    prosperaToken = ProsperaToken(_ownerContract);
  }

  // increases 2.95% from last minting
  function calculateMintAmount() returns (uint256 amount){
   return lastMintingAmount * 10295 / 10000;
  }

  function updateMintingStatus(uint256 _mintedAmount) internal {
    lastMintingAmount = _mintedAmount;
    lastMintingTime = block.timestamp;
    prosperaToken.incrementTotalSupply(_mintedAmount);
  }

  function mint() allowedMinting returns (bool success) {
    uint256 value = calculateMintAmount();
    prosperaToken.mintToAccount(msg.sender, value);
    updateMintingStatus(value);
    return true;
  }
}
