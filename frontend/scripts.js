let web3;
let contract;
const contractAddress = "0xDA31f7c371923694C792CC75E04Fcb47a9DE5b06";

async function initWeb3() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
  } else {
    alert("Please install MetaMask to use this application.");
    return;
  }

  const networkId = await web3.eth.net.getId();
  console.log("Connected to network:", networkId);

  const accounts = await web3.eth.getAccounts();
  document.getElementById("walletAddress").innerText = accounts[0];

  try {
    const response = await fetch(
      "../backend/build/contracts/MarriageContract.json"
    );
    const MarriageContract = await response.json();
    
    contract = new web3.eth.Contract(abiFile.abi, contractAddress, {
      from: accounts[0],
    });
    document.getElementById("connectWalletButton").style.backgroundColor =
      "gray";
    document.getElementById("connectWalletButton").disabled = true;
    getMarriageStatus();
  } catch (err) {
    console.error("Error loading contract ABI:", err);
  }
}

async function getMarriageStatus() {
  try {
    const status = await contract.methods.isMarried().call();
    document.getElementById("marriageStatus").innerText = status
      ? "Married"
      : "Divorce Initiated";
  } catch (err) {
    console.error("Error fetching marriage status:", err);
  }
}

async function initiateDivorce() {
  try {
    await contract.methods.initiateDivorce().send();
    getMarriageStatus();
  } catch (err) {
    console.error("Error initiating divorce:", err);
  }
}

async function addAsset() {
  const name = document.getElementById("assetName").value;
  const value = document.getElementById("assetValue").value;
  const isTokenized = document.getElementById("isTokenized").checked;

  try {
    await contract.methods.addAsset(name, value, isTokenized).send();
    alert("Asset added successfully!");
  } catch (err) {
    console.error("Error adding asset:", err);
  }
}

async function transferAsset() {
  const assetIndex = document.getElementById("assetIndex").value;
  const newOwnerAddress = document.getElementById("newOwnerAddress").value;

  try {
    await contract.methods.transferAsset(assetIndex, newOwnerAddress).send();
    alert("Asset transferred successfully!");
  } catch (err) {
    console.error("Error transferring asset:", err);
  }
}
