const hexToBinary = require('hex-to-binary');
const { GENESIS_DATA, MINE_RATE } = require('../config');
const { cryptoHash } = require('../util/');

class Block {
  // { } to rap args: no need to remember order of args when creating instatnce
  constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    // static: Call as from class name such Block.genesis(). No need to make instance. No need to change any data, so no need to make instance.
    // new this(): Same as `new Block()`
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }) {
    const lastHash = lastBlock.hash;
    let hash, timestamp;
    let { difficulty } = lastBlock;
    let nonce = 0;

    // hexToBinary(hash): Use binary to find hash due to higher speed / difficulty
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timestamp
      });
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
    } while (
      hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty)
    );

    return new this({
      timestamp,
      lastHash,
      data,
      nonce,
      difficulty,
      hash
    });
  }

  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;

    const difference = timestamp - originalBlock.timestamp;

    // Difficult limit as 1. Cannot become less than 0 because hash value will affect. ("x0" in the head)
    // return 1 === return (this.difficulty = 1 )
    if (difficulty < 1) {
      return 1;
    }

    // e.g.: Original(last) block: 3sec, NOW(timestamp): 5sec, difference = 2sec. 2 sec > 1 sec
    if (difference > MINE_RATE) {
      return difficulty - 1;
    }
    if (difference < MINE_RATE) {
      return difficulty + 1;
    }
  }
}

module.exports = Block;
