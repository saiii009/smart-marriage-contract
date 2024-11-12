pragma solidity ^0.8.21;

contract MarriageContract {
    address public spouse1;
    address public spouse2;
    bool public isMarried;

    struct Asset {
        string name;
        uint256 value;
        bool isTokenized;
        address owner;
    }
     
    Asset[] public assets;
    mapping(address => uint256[]) public ownerAssets; // Mapping to track assets by owner
    
    event Marriage(address indexed spouse1, address indexed spouse2);
    event DivorceInitiated(address indexed spouse);
    event Divorce(address indexed spouse1, address indexed spouse2, uint256 spouse1Share, uint256 spouse2Share);
    event AssetAdded(string name, uint256 value, bool isTokenized, address indexed owner);
    event AssetTransferred(string name, address indexed newOwner);

    modifier onlySpouses() {
        require(msg.sender == spouse1 || msg.sender == spouse2, "Not authorized");
        _;
    }

    constructor(address _spouse1, address _spouse2) {
        spouse1 = _spouse1;
        spouse2 = _spouse2;
        isMarried = true;
        emit Marriage(spouse1, spouse2);
    }

    function addAsset(string memory name, uint256 value, bool isTokenized, address owner) public onlySpouses returns (uint256) {
        require(isMarried, "Cannot add assets after divorce initiation");
        Asset memory newAsset = Asset(name, value, isTokenized, owner);
        assets.push(newAsset);
        ownerAssets[owner].push(assets.length - 1); // Store the index of the asset in the owner's list
        emit AssetAdded(name, value, isTokenized, owner);
        return assets.length - 1; // Return the index of the newly added asset
    }

    function listAssets() public view returns (string[] memory assetNames, uint256[] memory assetValues) {
        uint256[] memory ownedAssetIndexes = ownerAssets[msg.sender];
        uint256 count = ownedAssetIndexes.length;
    
        string[] memory names = new string[](count);
        uint256[] memory values = new uint256[](count);
    
        for (uint256 i = 0; i < count; i++) {
            uint256 assetIndex = ownedAssetIndexes[i];
            names[i] = assets[assetIndex].name;
            values[i] = assets[assetIndex].value;
        }
    
        return (names, values);
    }

    function transferAssetByName(string memory assetName, address newOwner) public onlySpouses {
        bool assetFound = false;
        for (uint256 i = 0; i < assets.length; i++) {
            if (keccak256(bytes(assets[i].name)) == keccak256(bytes(assetName))) {
                require(assets[i].owner == msg.sender, "Not the asset owner");

                _removeAssetFromOwner(assets[i].owner, i);

                assets[i].owner = newOwner;
                ownerAssets[newOwner].push(i);
                emit AssetTransferred(assets[i].name, newOwner);

                assetFound = true;
                break;
            }
        }
        require(assetFound, "Asset with the specified name not found");
    }
    
    function _removeAssetFromOwner(address owner, uint256 assetIndex) private {
        uint256[] storage ownerAssetIndexes = ownerAssets[owner];
        for (uint256 i = 0; i < ownerAssetIndexes.length; i++) {
            if (ownerAssetIndexes[i] == assetIndex) {
                ownerAssetIndexes[i] = ownerAssetIndexes[ownerAssetIndexes.length - 1];
                ownerAssetIndexes.pop();
                break;
            }
        }
    }

    function transferAsset(uint256 assetIndex, address newOwner) public onlySpouses {
        require(assetIndex < assets.length, "Invalid asset index");
        Asset storage asset = assets[assetIndex];
        require(asset.owner == msg.sender, "Not the asset owner");

        _removeAssetFromOwner(asset.owner, assetIndex);

        asset.owner = newOwner;
        ownerAssets[newOwner].push(assetIndex);
    
        emit AssetTransferred(asset.name, newOwner);
    }

    function initiateDivorce() public onlySpouses {
        require(isMarried, "Divorce already initiated or not married");
        isMarried = false;
        emit DivorceInitiated(msg.sender);
    }

    function distributeAssets(string memory method) public onlySpouses {
        require(!isMarried, "Must initiate divorce before asset distribution");

        uint256 totalValue = _getTotalAssetValue();
        require(totalValue > 0, "Total asset value must be greater than zero");

        if (keccak256(bytes(method)) == keccak256(bytes("equal"))) {
            _distributeEqually();
        } else if (keccak256(bytes(method)) == keccak256(bytes("proportional"))) {
            _distributeProportionally();
        } else if (keccak256(bytes(method)) == keccak256(bytes("ownership"))) {
            _distributeByOwnership();
        } else {
            revert("Invalid distribution method");
        }
    }

    function _distributeEqually() private {
        uint256 totalValue = _getTotalAssetValue();
        uint256 halfValue = totalValue / 2;

        uint256 spouse1Share = 0;
        uint256 spouse2Share = 0;

        for (uint256 i = 0; i < assets.length; i++) {
            if (spouse1Share < halfValue && spouse2Share < halfValue) {
                assets[i].owner = (spouse1Share <= spouse2Share) ? spouse1 : spouse2;
                if (assets[i].owner == spouse1) {
                    spouse1Share += assets[i].value;
                } else {
                    spouse2Share += assets[i].value;
                }
            }
        }

        emit Divorce(spouse1, spouse2, spouse1Share, spouse2Share);
    }

    function _distributeProportionally() private {
        uint256 totalValue = _getTotalAssetValue();
        uint256 spouse1Share = (totalValue * 60) / 100;  // Example: 60% to spouse1
        uint256 spouse2Share = totalValue - spouse1Share;  // 40% to spouse2

        uint256 currentSpouse1Share = 0;
        uint256 currentSpouse2Share = 0;

        for (uint256 i = 0; i < assets.length; i++) {
            if (currentSpouse1Share < spouse1Share && currentSpouse2Share < spouse2Share) {
                assets[i].owner = (currentSpouse1Share <= currentSpouse2Share) ? spouse1 : spouse2;
                if (assets[i].owner == spouse1) {
                    currentSpouse1Share += assets[i].value;
                } else {
                    currentSpouse2Share += assets[i].value;
                }
            }
        }

        emit Divorce(spouse1, spouse2, currentSpouse1Share, currentSpouse2Share);
    }

    function _distributeByOwnership() private {
        uint256 spouse1Share = 0;
        uint256 spouse2Share = 0;

        for (uint256 i = 0; i < assets.length; i++) {
            if (assets[i].owner == spouse1) {
                spouse1Share += assets[i].value;
            } else if (assets[i].owner == spouse2) {
                spouse2Share += assets[i].value;
            }
        }

        emit Divorce(spouse1, spouse2, spouse1Share, spouse2Share);
    }

    function _getTotalAssetValue() private view returns (uint256 totalValue) {
        for (uint256 i = 0; i < assets.length; i++) {
            totalValue += assets[i].value;
        }
    }

    function getAssetsByOwner(address owner) public view returns (uint256[] memory) {
        return ownerAssets[owner];
    }

    function getAssetDetails(uint256 assetIndex) public view returns (string memory name, uint256 value, bool isTokenized, address owner) {
        require(assetIndex < assets.length, "Invalid asset index");
        Asset memory asset = assets[assetIndex];
        return (asset.name, asset.value, asset.isTokenized, asset.owner);
    }

    function getAssetsCount() public view returns (uint256) {
        return assets.length;
    }
}
