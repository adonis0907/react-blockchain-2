const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock({ data }) {
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data
    });

    this.chain.push(newBlock);
  }

  replaceChain(chain) {
    if (chain.length <= this.chain.length) {
      console.error("The incoming chain must be longer");
      return;
    }

    // not replace if the coming chain is not valid
    if (!Blockchain.isValidChain(chain)) {
      console.error("the incoming chain must be valid");
      return;
    }

    console.log("replacing chain with", chain);
    this.chain = chain;
  }

  static isValidChain(chain) {
    // 2 objects in JS can't be triple equal or must the same underlying object instance. To fix, convert to JSON format. Block.genesis()は関数だからリストと同等に＝＝＝はできないと思う。だから、JSONフォーマットに変換する。
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    // Validate the chain field items
    for (let i = 1; i < chain.length; i++) {
      // Destructuring assignment
      // e.g.: { timestamp } = chain[1]; ==> access `chain[1].lastHash` just simply as `lastHash`
      const { timestamp, lastHash, hash, nonce, difficulty, data } = chain[i];
      const actualLastHash = chain[i - 1].hash;
      const lastDifficulty = chain[i - 1].difficulty;

      if (lastHash !== actualLastHash) {
        return false;
      }

      const validatedHash = cryptoHash(
        timestamp,
        lastHash,
        data,
        nonce,
        difficulty
      );
      if (hash !== validatedHash) {
        // Different value between `hash` and `validatedHash` if changed `data` like checked in test.
        //console.log(hash + "  |  " + validatedHash);
        return false;
      }
      // prevent jump difficulty attack (+/-)
      // abs: absolute value 絶対値（マイナスじゃない）difficultyをあげられて、ブロックの生成を遅くされる攻撃を防ぐ
      if (Math.abs(lastDifficulty - difficulty) > 1) return false;
    }

    return true;
  }
}

module.exports = Blockchain;
