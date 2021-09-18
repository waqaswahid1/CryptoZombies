// SPDX-License-Identifier: WaqasWahid
pragma solidity ^0.8.0;


import "./ZombieHelper.sol";
import "./SafeMath.sol";


contract ZombieAttack is ZombieHelper {

  using SafeMath for uint256;
  // 1. Declare using SafeMath32 for uint32
  using SafeMath32 for uint32;
  // 2. Declare using SafeMath16 for uint16
  using SafeMath16 for uint16;


  uint randNonce = 0;
  uint attackVictoryProbability = 70;

  function randMod(uint _modulus) internal returns(uint) {
    // Here's one!
    randNonce = randNonce.add(1);
    return uint(keccak256(abi.encodePacked(block.timestamp, msg.sender, randNonce))) % _modulus;
  }

  function attack(uint _zombieId, uint _targetId) external onlyOwnerOf(_zombieId) {
    Zombie storage myZombie = zombies[_zombieId];
    Zombie storage enemyZombie = zombies[_targetId];
    uint rand = randMod(100);
    if (rand <= attackVictoryProbability) {
      // Here's 3 more!
      myZombie.winCount = myZombie.winCount.add(1);
      myZombie.level = myZombie.level.add(1);
      enemyZombie.lossCount = enemyZombie.lossCount.add(1);
      feedAndMultiply(_zombieId, enemyZombie.dna, "zombie");
    } else {
      // ...annnnd another 2!
      myZombie.lossCount = myZombie.lossCount.add(1);
      enemyZombie.winCount = enemyZombie.winCount.add(1);
      _triggerCooldown(myZombie);
    }
  }
}