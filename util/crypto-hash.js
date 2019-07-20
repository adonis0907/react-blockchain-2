const crypto = require('crypto');

const cryptoHash = (...inputs) => {
  const hash = crypto.createHash('sha256');

  // join: make a "space" as separator for each listed element to make a combined string.
  // eg.["A" , "B", "C"] ==> >> "A B C"

  // map to json: to avoid `hash` duplication, to adopt update function (transaction.js), to make each hash by map. (JSは変数をコピーか、アップデートした場合、付属する既に作られたHashは同等となってしまう)

  hash.update(
    inputs
      .map(input => JSON.stringify(input))
      .sort()
      .join(' ')
  );

  return hash.digest('hex');
};

module.exports = cryptoHash;
