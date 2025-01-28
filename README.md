# smart-marriage-contract

This project is a decentralized application (DApp) for managing a marriage contract on the Ethereum blockchain. It includes a Solidity smart contract, `MarriageContract`, for registering assets between two spouses, initiating a divorce, and distributing assets. The frontend is built with HTML, JavaScript (Web3.js), and CSS, and can be served locally using VS Code Live Server.

## Prerequisites

1. **Node.js** and **npm** - Install from [Node.js website](https://nodejs.org/).
   
2. **Truffle** - Install globally:
   ```bash
   npm install -g truffle
   ```

3. **Ganache** - Install the Ganache CLI (or use the GUI):
   ```bash
   npm install -g ganache
   ```

4. **MetaMask** - Install the MetaMask extension in your browser.


## Getting Started

### Clone the repository
To begin, clone the project repository to your local machine by running the following commands:

```bash
git clone https://github.com/yourusername/MarriageContractDApp.git
cd smart-marriage-contract
```



### Setting Up the Local Blockchain:

1. Start Ganache to create a local blockchain. This will run on `http://127.0.0.1:8545` by default.

```bash 
ganache
```


### Prepare the front-end

2. Open the `makeMarriage.html` file using live server. If you're using Visual Studio Code, you can open the file by      right-clicking it and selecting `Open with Live Server`.


### Create a Contract

3. On the `makeMarriage.html` page,Enter the selected Ethereum addresses for two users (spouses).Click on the `Create Contract` button. This will deploy the smart marriage contract on the Ethereum blockchain.



### Prepare the back-end

4. Navigate to the `backend/build/contracts` folder and delete any existing contracts(.json files, if any). In the backend directory, run the following command to install the necessary dependencies:

```bash
cd backend/build/contracts
```
   Run the following command to install any necessary dependencies:

```bash
npm install
```
   Start the backend by running:
   
```bash
npm start
```

### Complete Contract Creation

5. Once the backend is running, return to the `makeMarriage.html` page and click `Create Contract` again.
After successful contract creation, an alert will confirm that the contract has been created.

### Access the Login Page

6. Click on the `Go to Login` button on the `makeMarriage.html` page to navigate to the login page where individual spouses can log in.

### Import Accounts into MetaMask

7. Copy the private keys of the users corresponding to the selected wallet addresses from Ganache. In MetaMask, navigate to the `Add account or hardware wallet` option and select the `Import Account` option and paste the private keys to import the accounts.


### Log In and Connect Wallet

8. Click the `Login` button on the login page to connect your MetaMask wallet. Once connected, additional sections will be enabled for further interaction with the contract.

### Now you're ready to use the different functions within the dashboard provided to you!!

