
/*
Usage:
  node mintTokens.js [file]

Params:
  file: tsv file with address and values deposited.

Example:
  node mintTokens.js deposits.txt
*/

const fs = require('fs');

const lastMintingAmount = 35103904887; // TODO: grab from network

const filePathIndex = process.argv;
const filePath = process.argv[2];

const readFile = (filePath) => {
  const file = fs.readFileSync(filePath, "utf-8");
  const lines = file.split("\n");
  const balances = [];
  for (var i = 0; i < lines.length; i++) {
    let line = lines[i].split("\t");
    let account = line[0];
    let value = line[1];
    if (account) {
      balances[account] = parseInt(value);
    }
  }
  return balances;
}

const balances = readFile(filePath);
const prspToReceive = {};
const totalDeposited = Object.values(balances).reduce((prev, value) => prev + value);

// console.log(`Total deposited\t${totalDeposited}`);
// console.log(`Minting amount \t${lastMintingAmount}`);

Object.keys(balances).map(k => {
  prspToReceive[k] = parseInt(balances[k] / totalDeposited * lastMintingAmount, 10);
  console.log(`${k}\t${prspToReceive[k]}`);
});

Object.keys(balances).map(k => {
  console.log(`ProsperInstance.transfer('${k}', ${prspToReceive[k]}, extraParams, cb);`);
});

console.log(`["${Object.keys(prspToReceive).join('", "')}"]`);
console.log(`[${Object.values(prspToReceive).join(',')}]`);
