// Replace with your contract address and ABI
const contractAddress = "0xDfA43eE31F79E01B6a9dD5cbe9BB9bA39830C010";
let contractABI;

// Load the ABI from the JSON file
fetch('contract-abi.json')
    .then(response => response.json())
    .then(data => {
        contractABI = data.abi;
        initApp();
    })
    .catch(error => console.error('Error loading ABI:', error));

async function initApp() {
    // Check if Web3 is injected
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);

        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const accounts = await web3.eth.getAccounts();
        const contract = new web3.eth.Contract(contractABI, contractAddress);

        document.getElementById('submitContract').onclick = async () => {
            const spouseName = document.getElementById('spouseName').value;
            try {
                const tx = await contract.methods.submitContract(spouseName).send({ from: accounts[0] });
                document.getElementById('status').innerText = 'Contract submitted: ' + tx.transactionHash;
            } catch (error) {
                console.error(error);
                document.getElementById('status').innerText = 'Transaction failed. Check console for details.';
            }
        };
    } else {
        document.getElementById('status').innerText = 'Please install MetaMask!';
    }
}
