// script.js
let web3;
let contract;
const contractAddress = "0xb91558B4afC3A6B56234c16248b5530D026d5A25";  // Replace with your contract's address from migration
const abi = [{
  inputs: [ [Object], [Object] ],
  stateMutability: 'nonpayable',
  type: 'constructor'
},
{
  anonymous: false,
  inputs: [ [Object], [Object], [Object], [Object] ],
  name: 'AssetAdded',
  type: 'event'
},
{
  anonymous: false,
  inputs: [ [Object], [Object] ],
  name: 'AssetTransferred',
  type: 'event'
},
{
  anonymous: false,
  inputs: [ [Object], [Object], [Object], [Object] ],
  name: 'Divorce',
  type: 'event'
},
{
  anonymous: false,
  inputs: [ [Object] ],
  name: 'DivorceInitiated',
  type: 'event'
},
{
  anonymous: false,
  inputs: [ [Object], [Object] ],
  name: 'Marriage',
  type: 'event'
},
{
  inputs: [ [Object] ],
  name: 'assets',
  outputs: [ [Object], [Object], [Object], [Object] ],
  stateMutability: 'view',
  type: 'function',
  constant: true
},
{
  inputs: [],
  name: 'isMarried',
  outputs: [ [Object] ],
  stateMutability: 'view',
  type: 'function',
  constant: true
},
{
  inputs: [ [Object], [Object] ],
  name: 'ownerAssets',
  outputs: [ [Object] ],
  stateMutability: 'view',
  type: 'function',
  constant: true
},
{
  inputs: [],
  name: 'spouse1',
  outputs: [ [Object] ],
  stateMutability: 'view',
  type: 'function',
  constant: true
},
{
  inputs: [],
  name: 'spouse2',
  outputs: [ [Object] ],
  stateMutability: 'view',
  type: 'function',
  constant: true
},
{
  inputs: [ [Object], [Object], [Object], [Object] ],
  name: 'addAsset',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
{
  inputs: [],
  name: 'initiateDivorce',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
{
  inputs: [ [Object] ],
  name: 'distributeAssets',
  outputs: [],
  stateMutability: 'nonpayable',
  type: 'function'
},
{
  inputs: [ [Object] ],
  name: 'getAssetsByOwner',
  outputs: [ [Object] ],
  stateMutability: 'view',
  type: 'function',
  constant: true
},
{
  inputs: [ [Object] ],
  name: 'getAssetDetails',
  outputs: [ [Object], [Object], [Object], [Object] ],
  stateMutability: 'view',
  type: 'function',
  constant: true
},
{
  inputs: [],
  name: 'getAssetsCount',
  outputs: [ [Object] ],
  stateMutability: 'view',
  type: 'function',
  constant: true
}]; // Copy the ABI from the Truffle build JSON file

async function initWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else {
        web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
    }
    const accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(abi, contractAddress, { from: accounts[0] });
}

// Example functions to interact with the contract
async function getMarriageStatus() {
    const status = await contract.methods.isMarried().call();
    document.getElementById("marriageStatus").innerText = status ? "Married" : "Divorce Initiated";
}

async function initiateDivorce() {
    await contract.methods.initiateDivorce().send();
    getMarriageStatus();  // Refresh the status on the UI
}

async function addAsset(name, value, isTokenized) {
    await contract.methods.addAsset(name, value, isTokenized, web3.eth.defaultAccount).send();
    alert("Asset added successfully");
}

window.onload = initWeb3;
