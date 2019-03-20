// v1: timestamp based
const uuid = require("uuid/v1");
const { verifySignature } = require("../util");

class Transaction {
  constructor({ senderWallet, recipient, amount }) {
    this.id = uuid();
    this.outputMap = this.createOutputMap({ senderWallet, recipient, amount });
    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  createOutputMap({ senderWallet, recipient, amount }) {
    const outputMap = {};

    outputMap[recipient] = amount;
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;

    return outputMap;
  }

  createInput({ senderWallet, outputMap }) {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      signature: senderWallet.sign(outputMap)
    };
  }

  //update the output and input
  update({ senderWallet, recipient, amount }) {
    if (amount > this.outputMap[senderWallet.publicKey]) {
      throw new Error("Amount exceeds balance");
    }

    if (!this.outputMap[recipient]) {
      // send amount
      this.outputMap[recipient] = amount;
    } else {
      this.outputMap[recipient] = this.outputMap[recipient] + amount;
    }

    // sender remain balance
    this.outputMap[senderWallet.publicKey] =
      this.outputMap[senderWallet.publicKey] - amount;

    // update the `create Input`
    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  static validTransaction(transaction) {
    // const { address, amount, signature } = input;
    const {
      input: { address, amount, signature },
      outputMap
    } = transaction;

    // To check all the value contained in the `outputMap`.
    const outputTotal = Object.values(outputMap).reduce(
      (total, outputAmount) => total + outputAmount
    );

    if (amount !== outputTotal) {
      console.error(`Invalid transaction from ${address}`);
      return false;
    }
    if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
      console.error(`Invalid signature from ${address}`);
      return false;
    }

    return true;
  }
}

module.exports = Transaction;
