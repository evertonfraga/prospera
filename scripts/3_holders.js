/*
 Usage:
  node holders.js --totalSupply value

*/

const got = require('got');
const cheerio = require('cheerio');
const endpoint = 'http://www.prsp.me/saldos/';
const apiKey = process.env.ETHERSCAN_API_KEY;

const Web3 = require('web3');
const web3 = new Web3('https://mainnet.infura.io');

const tokenAddress = '0x0C04d4f331DA8dF75f9E2e271E3f3F1494C66C36';
const pcdAddress = '0xa4E23286C06208645f52c57A6eF5a510e87A6d76';
const distributionBlacklist = ['0x376f0eb80530ab03be79d34ea2f65efee8bf4e69'];
const prosperTokenABI = require('./ProsperToken.abi');
const ProsperContract = new web3.eth.Contract(prosperTokenABI, tokenAddress);

// converts from <string>"0,123456789" to <int>123456789
const currencyParser = (value) => parseInt(parseFloat(value.replace(',', '.'), 10) * 1e9, 10);

const getTokenBalance = async (address) => ProsperContract.methods.balanceOf(address).call();

const getTokenBalances = (addressList) => {
  return Promise.all(addressList.map(tokenBalance));
}

const accountBalanceEndpoint = (address, apiKey) => `https://api.etherscan.io/api?module=account&action=balance&address=${address}&tag=latest&apikey=${apiKey}`;

let pcdBalance;
let balances = {};
let liveBalances = {};


got(accountBalanceEndpoint(pcdAddress, apiKey)).then((response) => {
  //pcdBalance = 1574697580000000000;
  pcdBalance = parseInt(JSON.parse(response.body).result);
})
.then(() => got(endpoint))
.then((result) => {
  const $ = cheerio.load(result.body);

  $('tbody tr').map((i, el) => {
    const address = $(el).find('strong').text();
    const balance = currencyParser($(el).find('td:last-of-type').text());

    if (balance > 0 && !distributionBlacklist.includes(address)) {
      balances[address] = balance;
    }
  });


  const totalSupplyFlagIndex = process.argv.indexOf('--totalSupply');
  if (totalSupplyFlagIndex != -1) {
    calculateEthDistribution(balances, totalSupplyFlagIndex, pcdBalance);
  } else {
    displayTokenBalances(balances);
  }
});


const calculateEthDistribution = (balances, totalSupplyFlagIndex, balance) => {
  const estimatedCosts = Object.keys(balances).length * 5e15; // 0.005 ETH por conta
  const totalSupply = parseInt(process.argv[totalSupplyFlagIndex + 1], 10);
  const totalEth = balance - estimatedCosts;

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
