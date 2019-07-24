# Blockchain-JavaScript

## Description

Making blockchain with JavaScript and React.

**_DEMO:_**

<img src="./client/src/assets/190723Blockchain-JS.jpg" width="80%">

## Features

- Proof of works with adjustable mining difficulty
- Dynamic (automatically) adjust the difficulty using comparing with last and latest generated block of timestamp
- Generate wallet with the public and private key
- Generate signature with SHA256 hash function
- Chain validation and replacement
- Add and read block with interacting with each other nodes by Express
- P2P network by Pub/Sub
- Testing functions with Jest

## Files

- config.js: Each setting with hard coding
- index.js: API settings
- client: React folder
- blockchain/index.js: Construct each block to one blockchain array, Chain validation and replacement
- blockchain/block.js: Functions about block and mining
- util/crypto-hash.js: Take args as `...input` to an array, then sort the `input...` array and join to avoid any order issue. Use SHA256 hash format and return by hex format
- util/index.js: Secp256k1 elliptic curves and verifySignature function
- script/average-work.js: Check difficulty level match with MINE_RATE according to local computer's mine power
- wallet/index.js: Create wallet with public/private key
- wallet/transaction.js: Create transactions

## Intro: Data contained in block

Each block will store the following data

- timestamp
- lastHash
- data
- hash
- nonce
- difficulty

## Intro: SHA-256 and Hexadecimal

- SHA: Secure Hash Algorism
- 256: 256bits for the hash which `1 or 0`

### Benefits

- A one-way function (Can't predict original input from the hashed output)
- Produces unique value for unique input. Same data for same hash but produce totally not the same hash if even changed 1 words

eg.
`Roy` => `010011010010101011...` (up to 256bits)

Most of all, will return by the `hexadecimal (hex)` format

eg.
`Roy` => `E3058EE8C04E482DE1D...` (up to 64 characters)

Ref: Go to test in this website [SHA256 Hash Generator](https://passwordsgenerator.net/sha256-hash-generator/)

#### hash (digest) format

Using `binary` format convert from hex due to building block more faster & higher difficulty than using with hex format.

```blockchain/block.js
const hexToBinary = require('hex-to-binary');
let hash

// Don't use hexToBinary() if choose hex format to find digest
hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty)
```

## Install

Clone repo, cd into folder and run:

```
$ yarn install
$ brew install redis
$ yarn run dev / $ yarn run dev-peer / $ yarn run start
```

See [this](https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298) if any install problem about Redis.

## Usage

### Run React

Open http://localhost:3000/ in your browser after process following either 1 or 2 command in terminal.

Type `sudo` before yarn (or nmp) in case showing an error.

1. Start with wallet balance as \$1000 and Genesis block :

   `$ yarn run start`

2. Start with wallet balance as \$2125 and few dummy transactions already created :

   `$ yarn run dev`

   2.1. Join the network as peered user:

   `$ yarn run dev-peer`

   Port number will show in the terminal as `Listening at localhost:XXXX` and only takes a few seconds after proceed above code.

### Run test

`$ yarn run test`

### Check difficulty level match with MINE_RATE

```console
$ cd script
$ node average-work
```

Wait for average time shows around on `MINE_RATE` ms. (Default as 1000ms)
Then can see the difficulty for `MINE_RATE` requirement.

### Blockchain API and network by Express

Use express and [Postman](https://www.getpostman.com/) to be able to read the blockchain and write the blockchain by json format.
See index.js for endpoint of each function.

Run as a publisher:

`$ yarn run dev`

Run as a subscriber:

`$ yarn run dev-peer`

#### GET Request

Read the blockchain.

#### POST Request

Add the new block to the blockchain and send to the network.
Set as `raw` and `JSON` in Body field of Postman to post each request.

### Pub/Sub feature -Redis or PubNub-

Using Redis as default realtime Pub/Sub feature.
However PubNub also able to handle same job for this application.
Need to change as following code to use PubNub instead of Redis.

index.js </br>
Comment out for `pubsub` with REDIS setting and remove comment for `pubsub` with PubSub instance.

```index.js
// const pubsub = new PubSub({ blockchain, transactionPool, redisUrl: REDIS_URL });

// for PubNub
const pubsub = new PubSub({ blockchain, transactionPool, wallet });
```

package.json</br>
delete `start-redis` in `dev` script

```
"dev": "npm run dev-client & npm run && cross-env ENV='development' nodemon index.js",
```

### PubNub Account

Use [PubNub](https://www.pubnub.com/) to work with Pub / Sub feature.
Open free account click with `Sign Up Free`, click `CREATE NEW APP` then copy the PUBLISH KEY, SUBSCRIBE KEY and SECRET KEY into `app/pubsub.pubnub.js`

※ PubNub required for connecting the network environment to work.

### P2P website

You can go to [this](https://my-crypto-blockchain-peer.herokuapp.com/) website to become another peered user.

[Repository]()

## Requirement

- yarn

## Tools

- Jest
- Elliptic with secp256k1
- Hex-to-binary
- UUID
- Express
- Nodemon
- BodyParser
- Postman
- PubSub by Redis or PubNub
- React
- React-bootstrap
- ReactRouter
- Parcel-bundler

## Licence

[MIT](./LICENSE.txt)

## Author

[Shoe Kure](https://github.com/roy1210)
