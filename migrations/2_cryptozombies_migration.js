// const  zombieFactory = artifacts.require("./ZombieFactory.sol");
// const  zombieAttack = artifacts.require("./ZombieAttack.sol");
// const  zombieFeeding = artifacts.require("./ZombieFeeding.sol");
// const  zombieHelper = artifacts.require("./ZombieHelper.sol");
const  zombieOwnership = artifacts.require("./ZombieOwnership.sol");

module.exports = function(deployer) {
  // deployer.deploy(zombieFactory);
  // deployer.deploy(zombieAttack);
  // deployer.deploy(zombieFeeding);
  // deployer.deploy(zombieHelper);
  deployer.deploy(zombieOwnership);
};