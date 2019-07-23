const express = require('express');

// Middleware for parse JSON HTTP request (body)
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const Blockchain = require('./blockchain');
const PubSub = require('./app/pubsub');
const TransactionPool = require('./wallet/transaction-pool');
const Wallet = require('./wallet');
const TransactionMiner = require('./app/transaction-miner');

const isDevelopment = process.env.ENV === 'development';

// const REDIS_URL = isDevelopment
//   ? 'redis://127.0.0.1:6379'
//   : 'redis://h:p05f9a274bd0e2414e52cb9516f8cbcead154d7d61502d32d9750180836a7cc05@ec2-34-225-229-4.compute-1.amazonaws.com:19289';　Problem

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
// const pubsub = new PubSub({ blockchain, transactionPool, redisUrl: REDIS_URL });
const pubsub = new PubSub({ blockchain, transactionPool, wallet }); // for PubNub
const transactionMiner = new TransactionMiner({
  blockchain,
  transactionPool,
  wallet,
  pubsub
});

app.use(bodyParser.json());

// express.static: Middleware function to use JS code which JS file located in client/dist'
// __dirname: Current directory
app.use(express.static(path.join(__dirname, 'client/dist')));

// `.get` to return blocks from back end.
// Arguments 1: end point on the server. 2: call back
// Access `/api/blocks`, then will get the response as json format to return the information of `blockchain.chain`.
// (req, res) : Populated by express. send port request and response
// Express sends back the `blockchain.chain` by json format to requester
app.get('/api/blocks', (req, res) => {
  res.json(blockchain.chain);
});

app.get('/api/blocks/length', (req, res) => {
  res.json(blockchain.chain.length);
});

app.get('/api/blocks/:id', (req, res) => {
  const { id } = req.params;
  const { length } = blockchain.chain;
  // slice: no arguments so it's copy original array
  const blocksReversed = blockchain.chain.slice().reverse();

  let startIndex = (id - 1) * 5;
  let endIndex = id * 5;

  startIndex = startIndex < length ? startIndex : length;
  endIndex = endIndex < length ? endIndex : length;

  res.json(blocksReversed.slice(startIndex, endIndex));
});

app.post('/api/mine', (req, res) => {
  // Body data (in body field): Requester adds to the blockchain
  const { data } = req.body;

  blockchain.addBlock({ data: data });

  pubsub.broadcastChain();

  res.redirect('/api/blocks');
});

app.post('/api/transact', (req, res) => {
  const { amount, recipient } = req.body;
  let transaction = transactionPool.existingTransaction({
    inputAddress: wallet.publicKey
  });

  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({
        recipient,
        amount,
        chain: blockchain.chain
      });
    }
  } catch (error) {
    // `return`: won't run below code after `retur` if returned due to error
    // better error msg when posting in postman
    return res.status(400).json({ type: 'error', message: error.message });
  }

  transactionPool.setTransaction(transaction);
  pubsub.broadcastTransaction(transaction);
  res.json({ type: 'success', transaction });
});

app.get('/api/transaction-pool-map', (req, res) => {
  res.json(transactionPool.transactionMap);
});

app.get('/api/mine-transactions', (req, res) => {
  transactionMiner.mineTransactions();
  res.redirect('/api/blocks');
});

app.get('/api/wallet-info', (req, res) => {
  const address = wallet.publicKey;

  res.json({
    address,
    balance: Wallet.calculateBalance({ chain: blockchain.chain, address })
  });
});

app.get('/api/known-addresses', (req, res) => {
  const addressMap = {};

  for (let block of blockchain.chain) {
    for (let transaction of block.data) {
      // key and value is same
      const recipient = Object.keys(transaction.outputMap);
      recipient.forEach(recipient => (addressMap[recipient] = recipient));
    }
  }

  res.json(Object.keys(addressMap));
});

// *: Any endpoint
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist/index.html'));
});

const syncWithRootState = () => {
  request(
    { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootChain = JSON.parse(body);

        console.log('replace chain on a sync with', rootChain);
        blockchain.replaceChain(rootChain);
      }
    }
  );

  request(
    { url: `${ROOT_NODE_ADDRESS}/api/transaction-pool-map` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootTransactionPoolMap = JSON.parse(body);

        console.log(
          'replace transaction pool map on a sync with',
          rootTransactionPoolMap
        );
        transactionPool.setMap(rootTransactionPoolMap);
      }
    }
  );
};

// Dummy transaction history for development only
if (isDevelopment) {
  const walletFoo = new Wallet();
  const walletBar = new Wallet();

  const generateWalletTransaction = ({ wallet, recipient, amount }) => {
    const transaction = wallet.createTransaction({
      recipient,
      amount,
      chain: blockchain.chain
    });

    transactionPool.setTransaction(transaction);
  };

  const walletAction = () =>
    generateWalletTransaction({
      wallet,
      //wallet: walletBar,
      recipient: walletFoo.publicKey,
      amount: 5
    });

  const walletFooAction = () =>
    generateWalletTransaction({
      wallet: walletFoo,
      recipient: walletBar.publicKey,
      amount: 10
    });

  const walletBarAction = () =>
    generateWalletTransaction({
      wallet: walletBar,
      recipient: wallet.publicKey,
      amount: 15
    });

  for (let i = 0; i < 20; i++) {
    if (i % 3 === 0) {
      walletAction();
      walletFooAction();
    } else if (i % 3 === 1) {
      walletAction();
      walletBarAction();
    } else {
      walletFooAction();
      walletBarAction();
    }

    transactionMiner.mineTransactions();
  }
}
let PEER_PORT;

// "false" for first port
if (process.env.GENERATE_PEER_PORT === 'true') {
  // Port==> 3000 + 1~1000.  math.random: decimal between 0~1.
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = process.env.PORT || PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`Listening at localhost:${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    syncWithRootState();
  }
});
