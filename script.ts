 javascript
   // Initialize web3 instance
   let web3;
   let contract;
   const contractAddress = 'YOUR_CONTRACT_ADDRESS';
   const contractABI = YOUR_CONTRACT_ABI;

   // Function to connect wallet using MetaMask
   async function connectWallet() {
       if (window.ethereum) {
           web3 = new Web3(window.ethereum);
           try {
               // Request account access
               const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
               document.getElementById('walletAddress').innerText = `Connected: ${accounts[0]}`;
               web3.eth.defaultAccount = accounts[0];
               initContract();
           } catch (error) {
               console.error("User denied account access", error);
           }
       } else {
           alert("Please install MetaMask to use this DApp!");
       }
   }

   // Initialize contract instance
   function initContract() {
       contract = new web3.eth.Contract(contractABI, contractAddress);
       getMarriageStatus();
   }

   // Function to get and display the marriage status
   async function getMarriageStatus() {
       const isMarried = await contract.methods.isMarried().call();
       document.getElementById('marriageStatus').innerText = isMarried ? "Married" : "Divorced";
   }

   // Function to add an asset
   async function addAsset() {
       const name = document.getElementById('assetName').value;
       const value = document.getElementById('assetValue').value;
       const isTokenized = document.getElementById('isTokenized').checked;

       await contract.methods.addAsset(name, value, isTokenized).send({ from: web3.eth.defaultAccount });
       alert('Asset added successfully!');
   }

   // Function to transfer an asset
   async function transferAsset() {
       const assetIndex = document.getElementById('assetIndex').value;
       const newOwner = document.getElementById('newOwnerAddress').value;

       await contract.methods.transferAsset(assetIndex, newOwner).send({ from: web3.eth.defaultAccount });
       alert('Asset transferred successfully!');
   }

   // Function to initiate divorce
   async function initiateDivorce() {
       await contract.methods.initiateDivorce().send({ from: web3.eth.defaultAccount });
       alert('Divorce initiated!');
       getMarriageStatus(); // Update status
   }

   // Function to list all assets
   async function listAssets() {
       const assetCount = await contract.methods.getAssetsCount().call();
       let assetList = '';

       for (let i = 0; i < assetCount; i++) {
           const asset = await contract.methods.getAssetDetails(i).call();
           assetList += `<p>Name: ${asset[0]}, Value: ${asset[1]}, Tokenized: ${asset[2]}, Owner: ${asset[3]}</p>`;
       }

       document.getElementById('assetList').innerHTML = assetList;
   }
   
