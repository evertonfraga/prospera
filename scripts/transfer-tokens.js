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

ProsperInstance.transfer('0x0bbc321371815344e607d694bee90fb43d5807be', 1056222642, extraParams, cb);
ProsperInstance.transfer('0x80607fb98a329dc80a172f317845107c9d9246d9', 528111321, extraParams, cb);
ProsperInstance.transfer('0xd00a832312a958b369565ac9077e78729cdeeb10', 1056222642, extraParams, cb);
ProsperInstance.transfer('0x3ec7ca8dcd1d5b78fa8d2f68ccf93989241d39c3', 369677924, extraParams, cb);
ProsperInstance.transfer('0x4ac2c5ddd3be5e96de03641a388110a8b82acf4a', 110375266, extraParams, cb);
ProsperInstance.transfer('0x80c98d3a3b38a9a51183cf5bed1766f6e81f1b86', 1790297378, extraParams, cb);
ProsperInstance.transfer('0xfbf24654e413c69a1e9611ff24084cf51f70a695', 4383323966, extraParams, cb);
ProsperInstance.transfer('0x6267fba6ddadfdf23be26f5ada03e64d86c0d3ab', 4383323966, extraParams, cb);
ProsperInstance.transfer('0xfd75aca54281d41a80828ac8f48c949e2af6e129', 211244528, extraParams, cb);
ProsperInstance.transfer('0x0b79f5110293b2446290aff4aaa06065c84e876b', 2112445284, extraParams, cb);

ProsperInstance.transfer('0x01991860cd86b4beab35bd8be564b6de0449d34e', 73935584, extraParams, cb);
ProsperInstance.transfer('0x3d58b2e892acd983e62c47338cd93a5582ad27c4', 1056222642, extraParams, cb);
ProsperInstance.transfer('0x1ad5841e64196af983068f7d92272f619653fd2a', 1895919643, extraParams, cb);
ProsperInstance.transfer('0x737a561881555cd42ccc82fc6b7d530247131b98', 913632585, extraParams, cb);
ProsperInstance.transfer('0x1f9d74c1c47a3a12241f65378cbe1fe8c9c6a70f', 85554034, extraParams, cb);
ProsperInstance.transfer('0x20ba7e2b293a6861c0d8e6445b3e3fffd91188c8', 147871169, extraParams, cb);
ProsperInstance.transfer('0x9a5b28d0e49607acbea505394376a4dbe99981cc', 475300189, extraParams, cb);
ProsperInstance.transfer('0x79203dfd0a66cd994f131d411640a84405075de4', 3337749077, extraParams, cb);
ProsperInstance.transfer('0x02f3659ac1efc5877da9696859ba64ebc3a237b3', 264055660, extraParams, cb);
ProsperInstance.transfer('0x2d9ed4814a1a78364561f947a1ab398947a3ff13', 1991196206, extraParams, cb);

ProsperInstance.transfer('0xe5ef3ec940976e9c5c8c16cf0289e6577407e567', 517549094, extraParams, cb);
ProsperInstance.transfer('0x1fddf7769e2590dc1ee9f0563f1c71d5653edfe1', 158433396, extraParams, cb);
ProsperInstance.transfer('0x72afd709b0604d8ed0fc7f2558a9d033242059de', 633733585, extraParams, cb);
ProsperInstance.transfer('0x376f0eb80530ab03be79d34ea2f65efee8bf4e69', 7551507094, extraParams, cb);
