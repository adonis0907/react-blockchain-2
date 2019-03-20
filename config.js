const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 3;

//  Screan case syntax: All caps, widely used soffer syntax. (Global) It's grab the attention.
const GENESIS_DATA = {
  timestamp: 1,
  lastHash: "____",
  hash: "hash-one",
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  data: []
};

const STARTING_BALANCE = 1000;

// Ommit the VALLUE due to KEY and VALUE is same
// == { GENESIS_DATA: GENESIS_DATA }
module.exports = { GENESIS_DATA, MINE_RATE, STARTING_BALANCE };
