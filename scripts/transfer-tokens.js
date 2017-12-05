// Run from the console

var abi = [ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string", "value": "Prosper" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256", "value": "750000000000" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8", "value": "9" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_account", "type": "address" }, { "name": "_amount", "type": "uint256" } ], "name": "mintToAccount", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "version", "outputs": [ { "name": "", "type": "string", "value": "0.1" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_recipients", "type": "address[]" }, { "name": "_values", "type": "uint256[]" } ], "name": "batchTransfer", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address", "value": "0xd1febd37ba7104f3b39341dcd3ee79a39f5845f9" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string", "value": "PRSP" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_extraData", "type": "bytes" } ], "name": "approveAndCall", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_incrementValue", "type": "uint256" } ], "name": "incrementTotalSupply", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "remaining", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [ { "name": "_owner", "type": "address" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newMinter", "type": "address" } ], "name": "setMinter", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "inputs": [ { "name": "_initialAmount", "type": "uint256", "index": 0, "typeShort": "uint", "bits": "256", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;initial Amount", "template": "elements_input_uint", "value": "750000000000" }, { "name": "_tokenName", "type": "string", "index": 1, "typeShort": "string", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;token Name", "template": "elements_input_string", "value": "Prosper" }, { "name": "_decimalUnits", "type": "uint8", "index": 2, "typeShort": "uint", "bits": "8", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;decimal Units", "template": "elements_input_uint", "value": "9" }, { "name": "_tokenSymbol", "type": "string", "index": 3, "typeShort": "string", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;token Symbol", "template": "elements_input_string", "value": "PRSP" } ], "payable": false, "type": "constructor" }, { "payable": false, "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_account", "type": "address" }, { "indexed": false, "name": "_amount", "type": "uint256" } ], "name": "Mint", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_spender", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" } ], "name": "Approval", "type": "event" } ];

var Prosper = web3.eth.contract(abi);
var ProsperInstance = Prosper.at(eth.accounts[0]);
var myAccount = eth.accounts[0];
var gasPrice = 10e9;
var extraParams = { from: myAccount, gasPrice: gasPrice };
var txs = [];
var cb = function(err, hash) { txs.push(hash); console.log(err, hash) };

personal.unlockAccount(myAccount);
var txStatus = function(){ return txs.map(function(tx){ return tx && !!eth.getTransaction(tx) })};

ProsperInstance.transfer('0xaddress', 1234567890, extraParams, cb);
