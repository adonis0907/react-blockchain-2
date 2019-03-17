const hexToBinary = require("hex-to-binary");
const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");

class Block {
  // let object {} as argument that makes readable code when use this function
  constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }

  static genesis() {
    // can use as Block.genesis(). No need make instance
    // this: refer to Block class == return new Block(GENESIS_DATA);
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }) {
    const lastHash = lastBlock.hash;
    // "let" to be reassigned within evry loop of this do-while block
    let hash, timestamp;
    let { difficulty } = lastBlock;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timestamp
      });
      hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
    } while (
      hexToBinary(hash).substring(0, difficulty) !== "0".repeat(difficulty)
    );

    return new this({
      timestamp,
      lastHash,
      data,
      nonce,
      difficulty,
      hash
      //hash: cryptoHash(timestamp, lastHash, data, nonce, difficulty)
    });
  }

  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;

    const difference = timestamp - originalBlock.timestamp;

    // Difficult limit as 1. Cannot become less than 0 because hash value will affect. ("x0" in the head)
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
    //return difficulty + 1;
  }
}

module.exports = Block;

// can allocate argument any position I want
// const block1 = new Block({
//   hash: "this##",
//   timestamp: "01/01/01",
//   lastHash: "last#",
//   data: "abcd"
// });
// console.log(block1);
