const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

class Block {
  // let object {} as argument that makes readable code when use this function
  constructor({ timestamp, lastHash, hash, data }) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  static genesis() {
    // can use as Block.genesis(). No need make instance
    // this: refer to Block class == return new Block(GENESIS_DATA);
    return new this(GENESIS_DATA);
  }

  static mineBlock({ lastBlock, data }) {
    const timestamp = Date.now();
    const lastHash = lastBlock.hash;

    return new this({
      timestamp,
      lastHash,
      data,
      hash: cryptoHash(timestamp, lastHash, data)
    });
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
