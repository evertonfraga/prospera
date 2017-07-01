var ProsperaToken = artifacts.require("./ProsperaToken.sol");
var Minter = artifacts.require("./Minter.sol");
var SampleRecipientSuccess = artifacts.require("./SampleRecipientSuccess.sol");

contract("ProsperaToken", function(accounts) {

//CREATION

    it("creation: should create an initial balance of 10000 for the creator", (done) => {
        ProsperaToken.new(10000, 'Prosper', 1, 'PRS', {from: accounts[0]}).then((ctr) => {
            return ctr.balanceOf.call(accounts[0]);
    }).then((result) => {
        assert.strictEqual(result.toNumber(), 10000);
        done();
        }).catch(done);
    });

    it("creation: test correct setting of vanity information", (done) => {
      var ctr;
        ProsperaToken.new(10000, 'Prosper', 1, 'PRS', {from: accounts[0]}).then((result) => {
            ctr = result;
            return ctr.name.call();
    }).then((result) => {
        assert.strictEqual(result, 'Prosper');
        return ctr.decimals.call();
    }).then((result) => {
        assert.strictEqual(result.toNumber(), 1);
        return ctr.symbol.call();
    }).then((result) => {
        assert.strictEqual(result, 'PRS');
        done();
        }).catch(done);
    });

    it("creation: should succeed in creating over 2^256 - 1 (max) tokens", (done) => {
        //2^256 - 1
        ProsperaToken.new('115792089237316195423570985008687907853269984665640564039457584007913129639935', 'Prosper', 1, 'PRS', {from: accounts[0]}).then((ctr) => {
            return ctr.totalSupply();
    }).then((result) => {
        var match = result.equals('1.15792089237316195423570985008687907853269984665640564039457584007913129639935e+77');
        assert.isTrue(match);
        done();
        }).catch(done);
    });

//TRANSERS
//normal transfers without approvals.

    //this is not *good* enough as the contract could still throw an error otherwise.
    //ideally one should check balances before and after, but estimateGas currently always throws an error.
    //it's not giving estimate on gas used in the event of an error.
    it("transfers: ether transfer should be reversed.", (done) => {
        var ctr;
        ProsperaToken.new(10000, 'Prosper', 1, 'PRS', {from: accounts[0]}).then((result) => {
            ctr = result;
            return web3.eth.sendTransaction({from: accounts[0], to: ctr.address, value: web3.toWei("10", "Ether")});
        }).catch((result) => {
            done();
        }).catch(done);
    });


    it("transfers: should transfer 10000 to accounts[1] with accounts[0] having 10000", (done) => {
        var ctr;
        ProsperaToken.new(10000, 'Prosper', 1, 'PRS', {from: accounts[0]}).then((result) => {
            ctr = result;
            return ctr.transfer(accounts[1], 10000, {from: accounts[0]});
        }).then((result) => {
            return ctr.balanceOf.call(accounts[1]);
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 10000);
            done();
        }).catch(done);
    });

    it("transfers: should fail when trying to transfer 10001 to accounts[1] with accounts[0] having 10000", (done) => {
        var ctr;
        ProsperaToken.new(10000, 'Prosper', 1, 'PRS', {from: accounts[0]}).then((result) => {
            ctr = result;
            return ctr.transfer.call(accounts[1], 10001, {from: accounts[0]});
        }).then((result) => {
            assert.isFalse(result);
            done();
        }).catch(done);
    });

    it("transfers: should fail when trying to transfer zero.", (done) => {
        var ctr;
        ProsperaToken.new(10000, 'Prosper', 1, 'PRS', {from: accounts[0]}).then((result) => {
            ctr = result;
            return ctr.transfer.call(accounts[1], 0, {from: accounts[0]});
        }).then((result) => {
            assert.isFalse(result);
            done();
        }).catch(done);
    });

    //NOTE: testing uint256 wrapping is impossible in this standard token since you can't supply > 2^256 -1.

    //todo: transfer max amounts.

//APPROVALS

    it("approvals: msg.sender should approve 100 to accounts[1]", (done) => {
        var ctr = null;
        ProsperaToken.new(10000, 'Prosper', 1, 'PRS', {from: accounts[0]}).then((result) => {
            ctr = result;
            return ctr.approve(accounts[1], 100, {from: accounts[0]});
        }).then((result) => {
            return ctr.allowance.call(accounts[0], accounts[1]);
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 100);
            done();
        }).catch(done);
    });

    it("approvals: msg.sender should approve 100 to SampleRecipient and then NOTIFY SampleRecipient. It should succeed.", (done) => {
        var ctr = null;
        var sampleCtr = null
        ProsperaToken.new(10000, 'Prosper', 1, 'PRS', {from: accounts[0]}).then((result) => {
            ctr = result;
            return SampleRecipientSuccess.new({from: accounts[0]});
        }).then((result) => {
            sampleCtr = result;
            return ctr.approveAndCall(sampleCtr.address, 100, '0x42', {from: accounts[0]});
        }).then((result) => {
            return ctr.allowance.call(accounts[0], sampleCtr.address);
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 100);
            return sampleCtr.value.call();
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 100);
            done();
        }).catch(done);
    });

    it("approvals: msg.sender should approve 100 to SampleRecipient and then NOTIFY SampleRecipient and throw.", (done) => {
        var ctr = null;
        var sampleCtr = null
        ProsperaToken.new(10000, 'Prosper', 1, 'PRS', {from: accounts[0]}).then((result) => {
            ctr = result;
            return SampleRecipientThrow.new({from: accounts[0]});
        }).then((result) => {
            sampleCtr = result;
            return ctr.approveAndCall.call(sampleCtr.address, 100, '0x42', {from: accounts[0]});
        }).catch((result) => {
            //It will catch OOG.
            done();
        }).catch(done)
    });

    //bit overkill. But is for testing a bug
    it("approvals: msg.sender approves accounts[1] of 100 & withdraws 20 once.", (done) => {
        var ctr = null;
        ProsperaToken.new(10000, 'Prosper', 1, 'PRS', {from: accounts[0]}).then((result) => {
            ctr = result;
            return ctr.balanceOf.call(accounts[0]);
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 10000);
            return ctr.approve(accounts[1], 100, {from: accounts[0]});
        }).then((result) => {
            return ctr.balanceOf.call(accounts[2]);
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 0);
            return ctr.allowance.call(accounts[0], accounts[1]);
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 100);
            return ctr.transferFrom.call(accounts[0], accounts[2], 20, {from: accounts[1]});
        }).then((result) => {
            return ctr.transferFrom(accounts[0], accounts[2], 20, {from: accounts[1]});
        }).then((result) => {
            return ctr.allowance.call(accounts[0], accounts[1]);
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 80);
            return ctr.balanceOf.call(accounts[2]);
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 20);
            return ctr.balanceOf.call(accounts[0]);
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 9980);
            done();
        }).catch(done);
    });

    //should approve 100 of msg.sender & withdraw 50, twice. (should succeed)
    it("approvals: msg.sender approves accounts[1] of 100 & withdraws 20 twice.", (done) => {
        var ctr = null;
        ProsperaToken.new(10000, 'Prosper', 1, 'PRS', {from: accounts[0]}).then((result) => {
            ctr = result;
            return ctr.approve(accounts[1], 100, {from: accounts[0]});
        }).then((result) => {
            return ctr.allowance.call(accounts[0], accounts[1]);
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 100);
            return ctr.transferFrom(accounts[0], accounts[2], 20, {from: accounts[1]});
        }).then((result) => {
            return ctr.allowance.call(accounts[0], accounts[1]);
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 80);
            return ctr.balanceOf.call(accounts[2]);
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 20);
            return ctr.balanceOf.call(accounts[0]);
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 9980);
            //FIRST tx done.
            //onto next.
            return ctr.transferFrom(accounts[0], accounts[2], 20, {from: accounts[1]});
        }).then((result) => {
            return ctr.allowance.call(accounts[0], accounts[1]);
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 60);
            return ctr.balanceOf.call(accounts[2]);
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 40);
            return ctr.balanceOf.call(accounts[0]);
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 9960);
            done();
        }).catch(done);
    });

    //should approve 100 of msg.sender & withdraw 50 & 60 (should fail).
    it("approvals: msg.sender approves accounts[1] of 100 & withdraws 50 & 60 (2nd tx should fail)", (done) => {
        var ctr = null;
        ProsperaToken.new(10000, 'Prosper', 1, 'PRS', {from: accounts[0]}).then((result) => {
            ctr = result;
            return ctr.approve(accounts[1], 100, {from: accounts[0]});
        }).then((result) => {
            return ctr.allowance.call(accounts[0], accounts[1]);
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 100);
            return ctr.transferFrom(accounts[0], accounts[2], 50, {from: accounts[1]});
        }).then((result) => {
            return ctr.allowance.call(accounts[0], accounts[1]);
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 50);
            return ctr.balanceOf.call(accounts[2]);
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 50);
            return ctr.balanceOf.call(accounts[0]);
        }).then((result) => {
            assert.strictEqual(result.toNumber(), 9950);
            //FIRST tx done.
            //onto next.
            return ctr.transferFrom.call(accounts[0], accounts[2], 60, {from: accounts[1]});
        }).then((result) => {
            assert.isFalse(result);
            done();
        }).catch(done);
    });

    it("approvals: attempt withdrawal from acconut with no allowance (should fail)", (done) => {
        var ctr = null;
        ProsperaToken.new(10000, 'Prosper', 1, 'PRS', {from: accounts[0]}).then((result) => {
            ctr = result;
            return ctr.transferFrom.call(accounts[0], accounts[2], 60, {from: accounts[1]});
        }).then((result) => {
              assert.isFalse(result);
              done();
        }).catch(done);
    });

    it("approvals: allow accounts[1] 100 to withdraw from accounts[0]. Withdraw 60 and then approve 0 & attempt transfer.", (done) => {
        var ctr = null;
        ProsperaToken.new(10000, 'Prosper', 1, 'PRS', {from: accounts[0]}).then((result) => {
            ctr = result;
            return ctr.approve(accounts[1], 100, {from: accounts[0]});
        }).then((result) => {
            return ctr.transferFrom(accounts[0], accounts[2], 60, {from: accounts[1]});
        }).then((result) => {
            return ctr.approve(accounts[1], 0, {from: accounts[0]});
        }).then((result) => {
            return ctr.transferFrom.call(accounts[0], accounts[2], 10, {from: accounts[1]});
        }).then((result) => {
              assert.isFalse(result);
              done();
        }).catch(done);
    });

    it("approvals: approve max (2^256 - 1)", (done) => {
        var ctr = null;
        ProsperaToken.new(10000, 'Prosper', 1, 'PRS', {from: accounts[0]}).then((result) => {
            ctr = result;
            return ctr.approve(accounts[1],'115792089237316195423570985008687907853269984665640564039457584007913129639935' , {from: accounts[0]});
        }).then((result) => {
            return ctr.allowance(accounts[0], accounts[1]);
        }).then((result) => {
            var match = result.equals('1.15792089237316195423570985008687907853269984665640564039457584007913129639935e+77');
            assert.isTrue(match);
            done();
        }).catch(done);
    });

// GENESIS - INITIAL DISTRIBUTION
  it("genesis: create contract and distribute initial tokens to holders", (done) => {
    var ctr = null;
    ProsperaToken.new(743.9317079e9, 'Prosper', 9, 'PRS', {from: accounts[0]}).then((result) => {
      ctr = result;
      return ctr.batchTransfer(['0xdc0b737b0ecbd36af000ffeda0bd7f8d5a676a85', '0x4eda2777a87af3d7657baaa0628a692449d13c73', '0xda6da6bdbee98d6cfcf0041712e145b1196cfce6', '0xa47e3c783404e4a05d4b6f027d0b13df877d8c92', '0x435be5d3091ee635fe85f72a0f0606904a0acfed'],
      [51900483600, 26000000000, 5000000000, 1580342300, 28235128300]);
    }).then((result) => {
      return ctr.balanceOf.call('0xdc0b737b0ecbd36af000ffeda0bd7f8d5a676a85');
    }).then((result) => {
      result.equals('51900483600');
      return ctr.balanceOf.call('0x435be5d3091ee635fe85f72a0f0606904a0acfed');
    }).then((result) => {
      result.equals('28235128300');
      done();
    }).catch(done);
  });

// Owner
  it('Owner: set and check ownership', (done) => {
    var prosperaToken = null;
    var minter = null;
    ProsperaToken.new(10000, 'Prosper', 1, 'PRS', {from: accounts[0]}).then((result) => {
      prosperaToken = result;
      return prosperaToken.owner.call();
    }).then((result) => {
      console.log('result', result);
      assert.strictEqual(result, accounts[0]);
      done();
    }).catch(done);
  });

  it('Owner: transfer ownership', (done) => {
    var prosperaToken = null;
    var minter = null;
    ProsperaToken.new(10000, 'Prosper', 1, 'PRS', {from: accounts[0]}).then((result) => {
      prosperaToken = result;
      console.log('account 0 ', accounts[0]);
      console.log('account 1 ', accounts[1]);
      return prosperaToken.transferOwnership.call(accounts[1], { from: accounts[0] });
    }).then((result) => {
      assert.strictEqual(result, accounts[1]);
      done();
    }).catch(done);
  });

  // it('Owner: transfer from non-owner', (done) => {
  //   var prosperaToken = null;
  //   var minter = null;
  //   ProsperaToken.new(10000, 'Prosper', 1, 'PRS', {from: accounts[0]}).then((result) => {
  //     prosperaToken = result;
  //     return prosperaToken.transferOwnership.call(accounts[1], { from: accounts[2] });
  //   }).catch((result) => done()).catch(done);
  // });
  //
  // it('Owner: does not allow to transfer ownership to 0x0', (done) => {
  //   var prosperaToken = null;
  //   var minter = null;
  //   ProsperaToken.new(10000, 'Prosper', 1, 'PRS', {from: accounts[0]}).then((result) => {
  //     prosperaToken = result;
  //     return prosperaToken.transferOwnership.call(0x0, { from: accounts[0] });
  //   }).catch((result) => done()).catch(done);
  // });

// Minter contract
  it('Minter: setting minter contract', (done) => {
    var prosperaToken = null;
    var minter = null;
    ProsperaToken.new(10000, 'Prosper', 1, 'PRS', {from: accounts[0]}).then((result) => {
      prosperaToken = result;
      console.log('prospera', result.address);
      return Minter.new(30, prosperaToken.address, {from: accounts[0]});
    }).then((result) => {
      console.log('minter', result.address);
      minter = result;

    }).then((result) => {
      done();
    });
  });




});
