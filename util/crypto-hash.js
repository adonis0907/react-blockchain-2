const crypto = require("crypto");
//const hexToBinary = require("hex-to-binary");

//...xxx: spread operator. can combine all the arguments into a xxx array
const cryptoHash = (...inputs) => {
  const hash = crypto.createHash("sha256");

  // join: make a "space" as separator for each listed element to make a combined string.
  // eg.["A" , "B", "C"] ==> >> "A B C"
  hash.update(
    inputs
      // to adopt update function (transaction.js), to make each hash by map. (JSは変数をコピーか、アップデートした場合、付属する既に作られたHashは同等となってしまう)
      .map(input => JSON.stringify(input))
      .sort()
      .join(" ")
  );
  // make hash as hex format
  return hash.digest("hex");
};

module.exports = cryptoHash;
