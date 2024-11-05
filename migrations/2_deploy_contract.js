const MarriageContract = artifacts.require("MarriageContract");

module.exports = function (deployer) {
  const spouse1 = "0xa881a184D0982140A822989333c59C5f10b4EBd6";  // Replace with Ganache address
  const spouse2 = "0x518FbdE72259C5f81F82012fc6F1d8Eee51e5dE8";  // Replace with Ganache address
  deployer.deploy(MarriageContract, spouse1, spouse2);
};
