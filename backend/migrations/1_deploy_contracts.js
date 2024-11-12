require("dotenv").config();
const MarriageContract = artifacts.require("MarriageContract");

module.exports = function (deployer) {
  const spouse1 = process.env.SPOUSE_1;
  const spouse2 = process.env.SPOUSE_2;

  deployer
    .deploy(MarriageContract, spouse1, spouse2)
    .then(() =>
      console.log(
        "Marriage Contract deployed for:\n" + spouse1 + " & \n" + spouse2,
        "\n\nat",
        MarriageContract.address + "\n\n"
      )
    );
};
