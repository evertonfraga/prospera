
const got = require('got');

const pcdAddress = '0xa4E23286C06208645f52c57A6eF5a510e87A6d76'.toLowerCase();
const apiKey = process.env.ETHERSCAN_API_KEY;
const prspPublishedBlock = 3965050;
const startBlock = 4838301 + 1; // TODO: override from argv
const endBlock = 5013986 + 1; // TODO: override from argv

const txListEndpoint = (pcdAddress, startBlock, endBlock, apiKey) => `http://api.etherscan.io/api?module=account&action=txlist&address=${pcdAddress}&startblock=${startBlock}&endblock=${endBlock}&sort=desc&apikey=${apiKey}`;
const internalTxListEndpoint = (pcdAddress, startBlock, endBlock, apiKey) => `http://api.etherscan.io/api?module=account&action=txlistinternal&address=${pcdAddress}&startblock=${startBlock}&endblock=${endBlock}&sort=desc&apikey=${apiKey}`;

var balances = [];

const accountForBalance = (account, value) => {
    if(balances[account] == undefined) balances[account] = 0;
    balances[account] += parseInt(value, 10);
};

const incomingOnly = tx => tx.from != pcdAddress;


got(txListEndpoint(pcdAddress, startBlock, endBlock, apiKey), {json: true}).then(response => {
  response.body.result.filter(incomingOnly).map(tx => {
    accountForBalance(tx.from, tx.value);
  });

  got(internalTxListEndpoint(pcdAddress, startBlock, endBlock, apiKey), {json: true}).then(internalResponse => {
    internalResponse.body.result.filter(incomingOnly).map(tx => {
      accountForBalance(tx.from, tx.value);
    });

    Object.keys(balances).map(k => {
      console.log(`${k}\t${balances[k]}`);
    });
  });
})
.catch(error => {
  console.error(error.response);
});
