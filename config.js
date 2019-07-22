const MINE_RATE = 1000;
const INITIAL_DIFFICULTY = 3;

const GENESIS_DATA = {
  // timestamp: new Data(),
  timestamp: 1,
  lastHash: '____',
  // hash: 'hash-one',
  hash: 'GENESIS_BLOCK',
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  data: []
};

const STARTING_BALANCE = 1000;

const REWARD_INPUT = {
  address: '*authorized-reward*'
};

const MINING_REWARD = 50;

// Ommit the VALLUE due to KEY and VALUE is same
// == { GENESIS_DATA: GENESIS_DATA }
module.exports = {
  GENESIS_DATA,
  MINE_RATE,
  STARTING_BALANCE,
  REWARD_INPUT,
  MINING_REWARD
};
