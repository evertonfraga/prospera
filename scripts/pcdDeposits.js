
const got = require('got');

const pcdAddress = '0xa4E23286C06208645f52c57A6eF5a510e87A6d76'.toLowerCase();
const apiKey = process.env.ETHERSCAN_API_KEY;
const prspPublishedBlock = 3965050;
const startBlock = 	4330496 + 1;
const endBlock = 4473116 + 1;

const apiEndpoint = (pcdAddress, startBlock, endBlock, apiKey) => `http://api.etherscan.io/api?module=account&action=txlist&address=${pcdAddress}&startblock=${startBlock}&endblock=${endBlock}&sort=desc&apikey=${apiKey}`;

var balances = [];

const accountForBalance = (account, value) => {
    if(balances[account] == undefined) balances[account] = 0;
    balances[account] += parseInt(value, 10);
};

const incomingOnly = tx => tx.from != pcdAddress;

console.log(apiEndpoint(pcdAddress, startBlock, endBlock, apiKey));

got(apiEndpoint(pcdAddress, startBlock, endBlock, apiKey)).then(response => {
  JSON.parse(response.body).result.filter(incomingOnly).map(tx => {
    accountForBalance(tx.from, tx.value);
  });

console.log(balances);
  Object.keys(balances).map(k => {
    console.log(`${k}\t${balances[k]}`);
  });
})
.catch(error => {
  console.error(error.response);
});
