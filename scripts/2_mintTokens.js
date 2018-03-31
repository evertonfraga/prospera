
/*
Usage:
  node mintTokens.js [file]

Params:
  file: tsv file with address and values deposited.

Example:
  node mintTokens.js deposits.txt
*/

// TODO: Blacklist disbursement address 0x376f0eb80530ab03be79d34ea2f65efee8bf4e69
// TODO: Blacklist disbursement address 0x376f0eb80530ab03be79d34ea2f65efee8bf4e69
// TODO: Blacklist disbursement address 0x376f0eb80530ab03be79d34ea2f65efee8bf4e69


const fs = require('fs');

const lastMintingAmount = 37205584448; // TODO: grab from network

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

console.log(`Total deposited\t${totalDeposited}`);
console.log(`Minting amount \t${lastMintingAmount}`);

console.log("\n\nPlain format:\n");
Object.keys(balances).map(k => {
  prspToReceive[k] = parseInt(balances[k] / totalDeposited * lastMintingAmount, 10);
  console.log(`${k}\t${prspToReceive[k]}`);
});

console.log("\n\nConsole script format: \n");
Object.keys(balances).map(k => {
  console.log(`ProsperInstance.transfer('${k}', ${prspToReceive[k]}, extraParams, cb);`);
});

console.log("\n\nAs contract parameters:\n");
console.log(`["${Object.keys(prspToReceive).join('", "')}"]\n`);
console.log(`[${Object.values(prspToReceive).join(',')}]`);
