const MarriageContract = artifacts.require("MarriageContract");

module.exports = function (deployer) {
  const spouse1 = "0x0B02138fA1d1C0Ca2864198b89995DAdD6DFBA70";
  const spouse2 = "0xfD6261F631aBf1D17492Be58859bfB1a5b7c85aF";
  deployer
    .deploy(MarriageContract, spouse1, spouse2)
    .then(() => console.log("Contract deployed at:", MarriageContract.address));
};
