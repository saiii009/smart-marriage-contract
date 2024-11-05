# smart-marriage-contract
# Marriage Contract DApp

This project is a decentralized application (DApp) for managing a marriage contract on the Ethereum blockchain. It includes a Solidity smart contract, `MarriageContract`, for registering assets between two spouses, initiating a divorce, and distributing assets. The frontend is built with HTML, JavaScript (Web3.js), and CSS, and can be served locally using VS Code Live Server.

## Prerequisites

1. **Node.js** and **npm** - Install from [Node.js website](https://nodejs.org/).
2. **Truffle** - Install globally:
   ```bash
   npm install -g truffle
   ```

3.Ganache - Install the Ganache CLI (or use the GUI):
   ```bash
   npm install -g ganache
   ```

4.MetaMask - Install the MetaMask extension in your browser.


Getting Started:

1.Clone the repository:

```bash
git clone https://github.com/yourusername/MarriageContractDApp.git
cd MarriageContractDApp
```

2.Install Project Dependencies: 
```bash
npm install
```


Setting Up the Local Blockchain:

1.Run Ganache to create a local blockchain at "http://127.0.0.1:8545".

```bash 
ganache
```


2.Open "truffle-config.js" and ensure the development network is configured as follows:

```bash
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
  },
  compilers: {
    solc: {
      version: "0.8.21",
    },
  },
};
```

Deploying the Smart Contract:

1.compile the smart contract:

```bash
truffle compile
```

2.Create a new migration file "2_deploy_contracts.js" in the migrations folder:

```bash
const MarriageContract = artifacts.require("MarriageContract");

module.exports = function (deployer) {
  const spouse1 = "0xAddressFromGanache"; // Replace with Ganache address
  const spouse2 = "0xAnotherAddressFromGanache"; // Replace with Ganache address
  deployer.deploy(MarriageContract, spouse1, spouse2);
};
```

3. Run the deployment:
``` bash
truffle migrate --network development
```
(or)

```bash
truffle migrate --reset --network development
```
