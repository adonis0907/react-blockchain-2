# Blockchain-JavaScript

## Description

Making blockchain with JavaScript and React.

## Features

- Proof of works with adjustable mining difficulty
- Dynamic (automatically) adjust the difficulty using comparing with last and latest generated block of timestamp
- Generate wallet with public and private key
- Generate signature with SHA256 hash function
- Chain validation and replacement
- Add and read block with interacting each other nodes by Express
- P2P network by Pub/Sub
- Testing functions with Jest

## Files

- config.js: Each settings with hard coding
- index.js: API settings
- blockchain/index.js: Construct the each blocks to one `blockchain` array, Chain validation and replacement
- blockchain/block.js: Functions about block and mining
- util/crypto-hash.js: Take args as `...input` to array, then sort the `input...` array and join to avoid any order issue. Use SHA256 hash format and return by hex format
- util/index.js: Secp256k1 elliptic curves and verifySignature function
- script/average-work.js: Check difficulty level match with MINE_RATE according to local computer's mine power
- wallet/index.js: Create wallet with public/private key

## Intro: Data contain in block

Each blocks will store following data

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

- A one-way function (Can't predict original input from hashed output)
- Produces unique value for unique input. Same data for same hash but produce totally not same hash if even changed 1 words

eg.
`Roy` => `010011010010101011...` (up to 256bits)

Most of all, will return by `hexadecimal (hex)` format

eg.
`Roy` => `E3058EE8C04E482DE1D...` (up to 64 characters)

Ref: Go to test in this website [SHA256 Hash Generato](https://passwordsgenerator.net/sha256-hash-generator/)

#### hash (digest) format

Using `binary` format convert from hex due to building block more faster & higher difficulty than using with hex format.

'''blockchain/block.js
const hexToBinary = require('hex-to-binary');
let hash

// Don't use hexToBinary() if choose hex format to find digest
hexToBinary(hash).substring(0, difficulty) !== '0'.repeat(difficulty)
'''

## Install

Clone repo, cd into folder and run:

'''
$ npm install
$ brew install redis
'''

Need to [install redis](https://medium.com/@petehouston/install-and-config-redis-on-mac-os-x-via-homebrew-eb8df9a4f298) to use Pub/Sub feature

## Usage

### Run test

`$ npm run test`

### Check difficulty level match with MINE_RATE

'''console
$ cd script
$ node average-work
'''

Wait for average time shows around on `MINE_RATE` ms. (Default as 1000ms)
Then can see the difficulty for `MINE_RATE` requirement.

### Blockchain API and network by Express

Use Pub/Sub feature to Be able to read the blockchain and write the blockchain by json format.
Listen a request by HTTP requests on each port.

May use [Postman](https://www.getpostman.com/) to handle Get and Post request.

Run as publisher:
`$ npm run dev`

Run as subscriber:

`$ npm run dev-peer`

#### GET Request

Read the blockchain.

#### POST Request

Add the new block to the blockchain and send to network.

## Requirement

- npm

## Tools

- Jest
- Elliptic with secp256k1
- Moment.js
- Express
- BodyParser
- Postman
- PubSub by Redis

## Licence

[MIT](./LICENSE.txt)

## Author

[Shoe Kure](https://github.com/roy1210)