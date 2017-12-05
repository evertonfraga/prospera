const got = require('got');
const cheerio = require('cheerio');
const endpoint = 'http://www.prsp.me/saldos/';
const Web3 = require('web3');
const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

const tokenAddress = '0x0C04d4f331DA8dF75f9E2e271E3f3F1494C66C36';

const tokenAbi = [ { "constant": true, "inputs": [], "name": "name", "outputs": [ { "name": "", "type": "string", "value": "Prosper" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "approve", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [ { "name": "", "type": "uint256", "value": "750000000000" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transferFrom", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [ { "name": "", "type": "uint8", "value": "9" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_account", "type": "address" }, { "name": "_amount", "type": "uint256" } ], "name": "mintToAccount", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "version", "outputs": [ { "name": "", "type": "string", "value": "0.1" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" } ], "name": "balanceOf", "outputs": [ { "name": "balance", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_recipients", "type": "address[]" }, { "name": "_values", "type": "uint256[]" } ], "name": "batchTransfer", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address", "value": "0xd1febd37ba7104f3b39341dcd3ee79a39f5845f9" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [ { "name": "", "type": "string", "value": "PRSP" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_to", "type": "address" }, { "name": "_value", "type": "uint256" } ], "name": "transfer", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }, { "name": "_extraData", "type": "bytes" } ], "name": "approveAndCall", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "_incrementValue", "type": "uint256" } ], "name": "incrementTotalSupply", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "constant": true, "inputs": [ { "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" } ], "name": "allowance", "outputs": [ { "name": "remaining", "type": "uint256", "value": "0" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [ { "name": "_owner", "type": "address" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "newMinter", "type": "address" } ], "name": "setMinter", "outputs": [ { "name": "success", "type": "bool" } ], "payable": false, "type": "function" }, { "inputs": [ { "name": "_initialAmount", "type": "uint256", "index": 0, "typeShort": "uint", "bits": "256", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;initial Amount", "template": "elements_input_uint", "value": "750000000000" }, { "name": "_tokenName", "type": "string", "index": 1, "typeShort": "string", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;token Name", "template": "elements_input_string", "value": "Prosper" }, { "name": "_decimalUnits", "type": "uint8", "index": 2, "typeShort": "uint", "bits": "8", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;decimal Units", "template": "elements_input_uint", "value": "9" }, { "name": "_tokenSymbol", "type": "string", "index": 3, "typeShort": "string", "bits": "", "displayName": "&thinsp;<span class=\"punctuation\">_</span>&thinsp;token Symbol", "template": "elements_input_string", "value": "PRSP" } ], "payable": false, "type": "constructor" }, { "payable": false, "type": "fallback" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_account", "type": "address" }, { "indexed": false, "name": "_amount", "type": "uint256" } ], "name": "Mint", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" } ], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_spender", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" } ], "name": "Approval", "type": "event" } ];

const ProsperContract = new web3.eth.Contract(tokenAbi, tokenAddress);

// converts from <string>"0,123456789" to <int>123456789
const currencyParser = (value) => {
  return parseInt(parseFloat(value.replace(',', '.'), 10) * 1e9, 10);
}

const getTokenBalance = async (address) => ProsperContract.methods.balanceOf(address).call();
const getTokenBalances = (addressList) => {
  return Promise.all(addressList.map(tokenBalance));
}

let balances = {};

got(endpoint).then((result) => {
  const $ = cheerio.load(result.body);

  $('tbody tr').map((i, el) => {
    const address = $(el).find('strong').text();
    const balance = currencyParser($(el).find('td:last-of-type').text());

    if (balance > 0) {
      balances[address] = balance;
    }
    // balances[address] = await getTokenBalance(address);
  });


  const totalSupplyFlagIndex = process.argv.indexOf('--totalSupply');
  const totalEthFlagIndex = process.argv.indexOf('--totalEth');
  if (totalSupplyFlagIndex != -1 && totalEthFlagIndex != -1) {
    calculateEthDistribution(balances, totalSupplyFlagIndex, totalEthFlagIndex);
  } else {
    displayTokenBalances(balances);
  }

});

const calculateEthDistribution = (balances, totalSupplyFlagIndex, totalEthFlagIndex) => {
  const estimatedCosts = Object.keys(balances).length * 2e15; // 0.002 ETH por conta
  const totalSupply = parseInt(process.argv[totalSupplyFlagIndex + 1], 10);
  const totalEth = parseInt(process.argv[totalEthFlagIndex + 1], 10) - estimatedCosts;

  Object.keys(balances).map(k => {
    const ethValueToReceive = parseInt(balances[k] / totalSupply * totalEth, 10);
    console.log(`${k}\t${ethValueToReceive}`);
  });
}

const displayTokenBalances = (b) => {
  Object.keys(b).map(k => {
    console.log(`${k}\t${balances[k]}`);
  });
}
