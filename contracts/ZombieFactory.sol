// SPDX-License-Identifier: WaqasWahid
pragma solidity ^0.8.0;

import "../node_modules/openzeppelin-contracts/access/Ownable.sol";
import "./SafeMath.sol";

contract ZombieFactory is Ownable {

  using SafeMath for uint256;
  // 1. Declare using SafeMath32 for uint32
  using SafeMath32 for uint32;
  // 2. Declare using SafeMath16 for uint16
  using SafeMath16 for uint16;

  event NewZombie(uint zombieId, string name, uint dna);

  uint dnaDigits = 16;
  uint dnaModulus = 10 ** dnaDigits;
  uint cooldownTime = 1 days;
  uint id = 0;

  struct Zombie {
    string name;
    uint dna;
    uint32 level;
    uint32 readyTime;
    uint16 winCount;
    uint16 lossCount;
  }

  Zombie[] public zombies;

  mapping (uint => address) public zombieToOwner;
  mapping (address => uint) ownerZombieCount;

  function _createZombie(string memory _name, uint _dna) internal {
    // Note: We chose not to prevent the year 2038 problem... So don't need
    // worry about overflows on readyTime. Our app is screwed in 2038 anyway ;)    
    zombies.push(Zombie(_name, _dna, 1, uint32(block.timestamp + cooldownTime), 0, 0));
    zombieToOwner[id] = msg.sender;

    ownerZombieCount[msg.sender] = ownerZombieCount[msg.sender].add(1);
    NewZombie(id, _name, _dna);
    id++;
  }

  function _generateRandomDna(string  memory _str) private view returns (uint) {
    uint rand = uint(keccak256(abi.encodePacked(_str)));
    return rand % dnaModulus;
  }

  function createRandomZombie(string memory _name) public {
    require(ownerZombieCount[msg.sender] == 0);
    uint randDna = _generateRandomDna(_name);
    randDna = randDna - randDna % 100;
    _createZombie(_name, randDna);
  }

}