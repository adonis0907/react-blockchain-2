const hexToBinary = require("hex-to-binary");
const Block = require("./block");
// {} because GENESIS_DATA was exported in an object.
const { GENESIS_DATA, MINE_RATE } = require("./config");
const cryptoHash = require("./crypto-hash");

describe("Block", () => {
  const timestamp = 2000;
  const lastHash = "foo-hash";
  const hash = "bar-hash";
  const data = ["blockchain", "data"];
  const nonce = 1;
  const difficulty = 1;
  const block = new Block({
    timestamp,
    lastHash,
    hash,
    data,
    nonce,
    difficulty
  });

  it("has a all property exist", () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.nonce).toEqual(nonce);
    expect(block.difficulty).toEqual(difficulty);
  });

  describe("genesis()", () => {
    const genesisBlock = Block.genesis();

    //console.log(genesisBlock);

    it("return a Block instance", () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });
    it("return the genesis data", () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });

  describe("mineBlock()", () => {
    const lastBlock = Block.genesis();
    const data = "mined data";
    const minedBlock = Block.mineBlock({ lastBlock, data });

    it("return a Block instance", () => {
      expect(minedBlock instanceof Block).toBe(true);
    });

    it("sets the `lasthash` to be the `hash` of the lastBlock ", () => {
      expect(minedBlock.lastHash).toEqual(lastBlock.hash);
    });

    it("sets the `data`", () => {
      expect(minedBlock.data).toEqual(data);
    });

    it("sets a `timestamp`", () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });
    //console.log(minedBlock);
    //console.log(lastBlock);

    it("create a SHA-256 `hash` based on the proper inputs", () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(
          minedBlock.timestamp,
          minedBlock.nonce,
          minedBlock.difficulty,
          lastBlock.hash,
          data
        )
      );
    });

    it("set a `hash` that matchs the difficulty criteria", () => {
      expect(
        hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)
      ).toEqual("0".repeat(minedBlock.difficulty));
    });

    it("adjusts the difficulty", () => {
      const possibleResults = [
        lastBlock.difficulty + 1,
        lastBlock.difficulty - 1
      ];

      expect(possibleResults.includes(minedBlock.difficulty)).toBe(true);
    });
  });

  describe("adjustDifficulty()", () => {
    it("raises the difficulty for a quikly mined block", () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE - 100
        })
        // 2900 - 2000 = 900 ==> Actual 900 < Rate 1000
      ).toEqual(block.difficulty + 1);
    });

    it("lower the difficulty for a slowly mined block", () => {
      expect(
        Block.adjustDifficulty({
          originalBlock: block,
          timestamp: block.timestamp + MINE_RATE + 100
        })
        // 3100 - 2000 = 1100 ==> Actual 1100 > Rate 1000
      ).toEqual(block.difficulty - 1);
    });

    it("has a lower limit of 1 (Difficult)", () => {
      block.difficulty = -1;
      expect(Block.adjustDifficulty({ originalBlock: block })).toEqual(1);
    });
  });
});

/* expect(1).toEqual(2). 1 ==> value defined in the test file. 2 ==> actial existing value

    console.log(minedBlock);
    console.log(lastBlock);
    >>
    .......
    console.log block.test.js:53
    Block {
      timestamp: 1552632511839,
      lastHash: 'hash-one',
      hash: undefined,
      data: 'mined data' }

    console.log block.test.js:54 (genesisBlock too)
    Block {
      timestamp: 1,
      lastHash: '____',
      hash: 'hash-one',
      data: [] }

    .......

*/
