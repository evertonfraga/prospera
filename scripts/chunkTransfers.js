const fs = require('fs');

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
    if (account.length > 0) {
      balances[account] = parseInt(value);
    }
  }
  return balances;
}

const readLines = (filePath) => {
  const file = fs.readFileSync(filePath, "utf-8");
  return file.split("\n");
}


const makeChunks = (array, size) => {
  return array.reduce((ar, it, i) => {
    const ix = Math.floor(i / size);

    if(!ar[ix]) {
      ar[ix] = [];
    }

    ar[ix].push(it);

    return ar;
  }, []);
}

const lines = readLines(filePath);
console.log(lines);

let chunks = makeChunks(lines, 22);
console.log("\n\nChunks");
console.log(chunks);

let nonce = 8;

chunks.forEach(c => {
  let accounts = [];
  let values = [];
  c.forEach(l => {
      const line = l.split("\t");
      accounts.push(line[0]);
      values.push(parseInt(line[1], 10));
  });

  console.log('\n\nChunk ', nonce);
  console.log("Value: ", values.reduce((prev, cur) => prev + cur, 0) / 1e18);
  console.log(`["${accounts.join('", "')}"], ["${values.join('", "')}"], ${nonce++}`);
});
