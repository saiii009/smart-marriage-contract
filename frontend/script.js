let web3;
let contract;
let currentSpouseAccount;

async function initWeb3() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
  } else {
    alert("Please install MetaMask to use this application.");
    return;
  }
  currentSpouseAccount = localStorage.getItem("currentSpouseAccount");

  document.getElementById("walletAddress").innerText = currentSpouseAccount;
  document.querySelectorAll("input, button, select").forEach((element) => {
    element.disabled = false;
  });
  document.getElementById("maindiv").classList.add("opacity-100");

  try {
    const response = await fetch(
      "../backend/build/contracts/MarriageContract.json"
    );
    const MarriageContract = await response.json();
    const { abi, networks } = MarriageContract;

    const networkKey = Object.keys(networks)[0];

    contract = new web3.eth.Contract(abi, networks[networkKey].address, {
      from: currentSpouseAccount,
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

    if (!status) {
      document.getElementById("initiateDivorceButton").style.backgroundColor =
        "gray";
    }
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

  const owner = currentSpouseAccount;

  try {
    await contract.methods.addAsset(name, value, false, owner).send();
    alert("Asset added successfully!");
  } catch (err) {
    console.error("Error adding asset:", err);
  }
}

async function transferAsset() {
  const assetName = document.getElementById("assetName").value;
  const newOwnerAddress = document.getElementById("newOwnerAddress").value;

  try {
    await contract.methods
      .transferAssetByName(assetName, newOwnerAddress)
      .send();
    alert("Asset transferred successfully!");
  } catch (err) {
    console.error("Error transferring asset:", err);
  }
}

async function listAssets() {
  try {
    const info = await contract.methods
      .listAssets()
      .call({ from: currentSpouseAccount });

    const assetNames = info.assetNames;
    const assetValues = info.assetValues;

    const assetListContainer = document.getElementById("assetList");
    assetListContainer.innerHTML = "";

    if (assetNames.length === 0) {
      assetListContainer.innerHTML =
        "<p>No assets found for the current account.</p>";
      return;
    }

    assetNames.forEach((name, index) => {
      const listItem = document.createElement("div");
      listItem.innerHTML = `Asset Name: ${name}, Value: ${assetValues[index]} ETH`;
      assetListContainer.appendChild(listItem);
    });
  } catch (error) {
    console.error("Error fetching assets:", error);
    alert("An error occurred while fetching the assets.");
  }
}

async function distributeAssets() {
  const method = document.getElementById("distributionMethod").value;

  if (!method) {
    alert("Please select a distribution method.");
    return;
  }

  try {
    await contract.methods.distributeAssets(method).send();
    alert("Assets distributed successfully!");

    listAssets();
  } catch (err) {
    console.error("Error distributing assets:", err);
    alert("An error occurred while distributing assets.");
  }
}
