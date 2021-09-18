const ZombieFactory = artifacts.require("ZombieFactory");
const ZombieAttack = artifacts.require("ZombieAttack");
const ZombieOwnership = artifacts.require("ZombieOwnership");

const utils = require("./helpers/utils");
const zombieNames = ["Zombie 1", "Zombie 2"];
const expect = require('chai').expect;
const latestTime = require("./helpers/latestTime")
const { increaseTimeTo, duration } = require("./helpers/increaseTime");



contract("CryptoZombies", (accounts) => {
    let [account1, account2] = accounts;
    let contractInstance;
    beforeEach(async () => {
        zombieFactory = await ZombieFactory.new();
        zombieAttack = await ZombieAttack.new();
        zombieOwnership = await ZombieOwnership.new();
    });
    it("should be able to create a new zombie", async () => {
        const result = await zombieOwnership.createRandomZombie(zombieNames[0], {from: account1});

        expect(result.receipt.status).to.equal(true);
        expect(result.logs[0].args.name).to.equal(zombieNames[0]);
    })
    it("should not allow two zombies", async () => {
        await zombieOwnership.createRandomZombie(zombieNames[0], {from: account1});
        await utils.shouldThrow(zombieOwnership.createRandomZombie(zombieNames[1], {from: account1}));
    })

    context("with the single-step transfer scenario", async () => {
        it("should transfer a zombie", async () => {
          const result = await zombieOwnership.createRandomZombie(zombieNames[0], {from: account1});
          const zombieId = result.logs[0].args.zombieId.toNumber();
          await zombieOwnership.transferFrom(account1, account2, zombieId, {from: account1});
          const newOwner = await zombieOwnership.ownerOf(zombieId);
          assert.equal(newOwner, account2);
        })
    })
    context("with the two-step transfer scenario", async () => {
        it("should approve and then transfer a zombie when the approved address calls transferFrom", async () => {
          const result = await zombieOwnership.createRandomZombie(zombieNames[0], {from: account1});
          const zombieId = result.logs[0].args.zombieId.toNumber();
          await zombieOwnership.approve(account2, zombieId, {from: account1});
          await zombieOwnership.transferFrom(account1, account2, zombieId, {from: account2});
          const newOwner = await zombieOwnership.ownerOf(zombieId);
          expect(newOwner).to.equal(account2);
        })
        it("should approve and then transfer a zombie when the owner calls transferFrom", async () => {
            
        const result = await zombieOwnership.createRandomZombie(zombieNames[0], {from: account1});
        const zombieId = result.logs[0].args.zombieId.toNumber();
        await zombieOwnership.approve(account2, zombieId, {from: account1});
        await zombieOwnership.transferFrom(account1, account2, zombieId, {from: account1});
        const newOwner = await zombieOwnership.ownerOf(zombieId);
        expect(newOwner).to.equal(account2);
    })

        it("zombies should be able to attack another zombie", async () => {
            let result;
            result = await zombieOwnership.createRandomZombie(zombieNames[0], {from: account1});
            const firstZombieId = result.logs[0].args.zombieId.toNumber();
            result = await zombieOwnership.createRandomZombie(zombieNames[1], {from: account2});
            const secondZombieId = result.logs[0].args.zombieId.toNumber();
            const currentTime = await latestTime().timestamp;
            await increaseTimeTo(currentTime + duration.days(1));
            await zombieOwnership.attack(firstZombieId, secondZombieId, {from: account1});
            expect(result.receipt.status).to.equal(true);
        })
    })
})