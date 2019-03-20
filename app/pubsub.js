const redis = require("redis");

const CHANNELS = {
  TEST: "TEST",
  BLOCKCHAIN: "BLOCKCHAIN"
};

class PubSub {
  constructor({ blockchain }) {
    this.blockchain = blockchain;

    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();

    // this.subscriber.subscribe(CHANNELS.TEST);
    // this.subscriber.subscribe(CHANNELS.BLOCKCHAIN);
    this.subscribeToChannels();

    this.subscriber.on("message", (channel, message) =>
      this.handleMessage(channel, message)
    );
  }

  handleMessage(channel, message) {
    console.log(`Message received. Channel: ${channel}. Message: ${message}`);

    const parsedMessage = JSON.parse(message);

    if (channel === CHANNELS.BLOCKCHAIN) {
      this.blockchain.replaceChain(parsedMessage);
    }
  }
  subscribeToChannels() {
    Object.values(CHANNELS).forEach(channel => {
      this.subscriber.subscribe(channel);
    });
  }

  publish({ channel, message }) {
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel);
      });
    });
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      // only can publish
      message: JSON.stringify(this.blockchain.chain)
    });
  }
}

// exports PubSub CLASS
module.exports = PubSub;

// const testPubSub = new PubSub();
// setTimeout(() => {
//   testPubSub.publisher.publish(CHANNELS.TEST, "foo");
// }, 1000);
// // >> Message received. Channel: TEST. Message: foo
