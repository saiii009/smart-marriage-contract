const MarriageContract = artifacts.require("MarriageContract");

module.exports = function (deployer) {
  const spouse1 = "0x33974F810f299101ce1b03bAfeB8e03ccb8c3671"; // Replace with Ganache address
  const spouse2 = "0x05a86a0d22F15ede395E1c3338873585cE0F1ED1"; // Replace with Ganache address
  deployer.deploy(MarriageContract, spouse1, spouse2);
};