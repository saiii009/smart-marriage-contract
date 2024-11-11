const MarriageContract = artifacts.require("MarriageContract");

module.exports = function (deployer) {
  const spouse1 = "0x0B67b847B7750438Eaa70092AB1876e317acD83E";
  const spouse2 = "0x0B02138fA1d1C0Ca2864198b89995DAdD6DFBA70";
  deployer
    .deploy(MarriageContract, spouse1, spouse2)
    .then(() => console.log("Contract deployed at:", MarriageContract.address));
};
