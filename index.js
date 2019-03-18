const express = require("express");
// bodyParserミドルウェアはHTTPのリクエストボディをparseするためのもの
const bodyParser = require("body-parser");
const request = require("request");
const Blockchain = require("./blockchain");
const PubSub = require("./pubsub");

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

const DEFAULT_PORT = 3000;
const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

//setTimeout(() => pubsub.broadcastChain(), 1000);

app.use(bodyParser.json());

// `.get` to return blocks from back end.
// Arguments 1: end point on the server. 2: call back
// Access `/api/blocks`, then will get the response as json format to return the information of `blockchain.chain`.
app.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

app.post("/api/mine", (req, res) => {
  // Body data (in body field): Requester adds to the blockchain.
  const { data } = req.body;

  blockchain.addBlock({ data: data });

  pubsub.broadcastChain();

  // automatically `get` the block
  res.redirect("/api/blocks");
});

const syncChain = () => {
  request(
    { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
    (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const rootChain = JSON.parse(body);

        console.log("replace chain on a sync with", rootChain);
        blockchain.replaceChain(rootChain);
      }
    }
  );
};

let PEER_PORT;

// "false" for first port
if (process.env.GENERATE_PEER_PORT === "true") {
  // Port==> 3000 + 1~1000.  math.random: decimal between 0~1.
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const PORT = PEER_PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`Listening at localhost:${PORT}`);

  if (PORT !== DEFAULT_PORT) {
    syncChain();
  }
});
