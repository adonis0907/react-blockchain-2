const Blockchain = require('../blockchain');

// blockchain [0]
const blockchain = new Blockchain();

// blockchain[1]
blockchain.addBlock({ data: 'initial' });
console.log('first block', blockchain.chain[blockchain.chain.length - 1]);

let prevTimestamp, nextTimestamp, nextBlock, average;
const times = [];

for (let i = 0; i < 10000; i++) {
  // blockchain[1].timestamp~
  prevTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;

  // blockchain[2]~
  blockchain.addBlock({
    data: `block ${i}`
  });

  // blockchain[2]~
  nextBlock = blockchain.chain[blockchain.chain.length - 1];
  nextTimestamp = nextBlock.timestamp;

  timeDiff = nextTimestamp - prevTimestamp;
  times.push(timeDiff);

  //.reduce: total(累積値) ＋ num (足される各要素)
  average = times.reduce((total, num) => total + num) / times.length;

  console.log(
    `Time to mine block: ${timeDiff}ms. Difficulty:${
      nextBlock.difficulty
    }. Average time:${average}ms`
  );
}
