// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import '@openzeppelin/contracts/token/ERC721/ERC721.sol';
import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/utils/Counters.sol';

contract Faucet is ERC721 {
  using Counters for Counters.Counter;
  Counters.Counter private _bondTokenId;
  
  constructor() ERC721("SmartSolarBOND", "SBND") {}

  function faucet() public {
  
    address _target = msg.sender;
    _bondTokenId.increment();
    
    uint256 newbondTokenId = _bondTokenId.current();
    _mint(_target, newbondTokenId);
  }
}

