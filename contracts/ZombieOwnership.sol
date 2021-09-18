// SPDX-License-Identifier: WaqasWahid
pragma solidity ^0.8.0;

import "../node_modules/openzeppelin-contracts/token/ERC721/ERC721.sol";
// import "./erc721.sol";
import "./ZombieAttack.sol";
import "./SafeMath.sol";


/// @title A contract that manages transfering zombie ownership
/// @author Roberto B
/// @dev Compliant with OpenZeppelin's implementation of the ERC721 spec draft
abstract contract ZombieOwnership is ZombieAttack, ERC721 {

  using SafeMath for uint256;

  mapping (uint => address) zombieApprovals;

  function _transfer(address _from, address _to, uint256 _tokenId) internal override {
    ownerZombieCount[_to] = ownerZombieCount[_to].add(1);
    ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].sub(1);
    zombieToOwner[_tokenId] = _to;
    Transfer(_from, _to, _tokenId);
  }

  function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
    _transfer(msg.sender, _to, _tokenId);
  }

  function approve(address _to, uint256 _tokenId) public override onlyOwnerOf(_tokenId) {
    zombieApprovals[_tokenId] = _to;
    Approval(msg.sender, _to, _tokenId);
  }

  function takeOwnership(uint256 _tokenId) public {
    require(zombieApprovals[_tokenId] == msg.sender);
    address owner = ownerOf(_tokenId);
    _transfer(owner, msg.sender, _tokenId);
  }
}