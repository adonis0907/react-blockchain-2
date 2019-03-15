const Block = require("./block");
// {} because GENESIS_DATA was exported in an object.
const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

describe("Block", () => {
  const timestamp = "a-date";
  const lastHash = "foo-hash";
  const hash = "bar-hash";
  const data = ["blockchain", "data"];
  const block = new Block({ timestamp, lastHash, hash, data });

  it("has a all property exist", () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastHash).toEqual(lastHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
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
    console.log(minedBlock);
    console.log(lastBlock);

    it("create a SHA-256 `hash` based on the proper inputs", () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(minedBlock.timestamp, lastBlock.hash, data)
      );
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
