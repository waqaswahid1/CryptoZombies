const ZombieFactory = artifacts.require("ZombieFactory");
const ZombieAttack = artifacts.require("ZombieAttack");
const utils = require("./helpers/utils");
const time = require("./helpers/time");
const zombieNames = ["Zombie 1", "Zombie 2"];
const expect = require('chai').expect;


contract("CryptoZombies", (accounts) => {
    let [account1, account2] = accounts;
    let contractInstance;
    beforeEach(async () => {
        zombieFactory = await ZombieFactory.new();
        zombieAttack = await ZombieAttack.new();
    });
    it("should be able to create a new zombie", async () => {
        const result = await zombieFactory.createRandomZombie(zombieNames[0], {from: account1});

        expect(result.receipt.status).to.equal(true);
        expect(result.logs[0].args.name).to.equal(zombieNames[0]);
    })
    it("should not allow two zombies", async () => {
        // start here
        await zombieFactory.createRandomZombie(zombieNames[0], {from: account1});
        await utils.shouldThrow(zombieFactory.createRandomZombie(zombieNames[1], {from: account1}));
    })

    context("with the single-step transfer scenario", async () => {
        it("should transfer a zombie", async () => {
          // start here.
          const result = await zombieFactory.createRandomZombie(zombieNames[0], {from: account1});
          const zombieId = result.logs[0].args.zombieId.toNumber();
          await zombieFactory.transferFrom(account1, account2, zombieId, {from: account1});
          const newOwner = await zombieFactory.ownerOf(zombieId);
          assert.equal(newOwner, account2);
        })
    })
    context("with the two-step transfer scenario", async () => {
        it("should approve and then transfer a zombie when the approved address calls transferFrom", async () => {
          // TODO: Test the two-step scenario.  The approved address calls transferFrom
          const result = await zombieFactory.createRandomZombie(zombieNames[0], {from: account1});
          const zombieId = result.logs[0].args.zombieId.toNumber();
          // start here
          await zombieFactory.approve(account2, zombieId, {from: account1});
          await zombieFactory.transferFrom(account1, account2, zombieId, {from: account2});
          const newOwner = await zombieFactory.ownerOf(zombieId);
          expect(newOwner).to.equal(bob);
        })
        it("should approve and then transfer a zombie when the owner calls transferFrom", async () => {
            // TODO: Test the two-step scenario.  The owner calls transferFrom
            
        const result = await zombieFactory.createRandomZombie(zombieNames[0], {from: account1});
        const zombieId = result.logs[0].args.zombieId.toNumber();
          // start here
        await zombieFactory.approve(account2, zombieId, {from: account1});
        await zombieFactory.transferFrom(account1, account2, zombieId, {from: account1});
        const newOwner = await zombieFactory.ownerOf(zombieId);
        expect(newOwner).to.equal(bob);
    })

        it("zombies should be able to attack another zombie", async () => {
            let result;
            result = await zombieFactory.createRandomZombie(zombieNames[0], {from: alice});
            const firstZombieId = result.logs[0].args.zombieId.toNumber();
            result = await zombieFactory.createRandomZombie(zombieNames[1], {from: bob});
            const secondZombieId = result.logs[0].args.zombieId.toNumber();
            //TODO: increase the time
            await time.increase(time.duration.days(1));
            await zombieAttack.attack(firstZombieId, secondZombieId, {from: alice});
            expect(result.receipt.status).to.equal(true);
        })
    })
})