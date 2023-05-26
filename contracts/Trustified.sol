// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./comman/ERC721URIStorage.sol";
import "hardhat/console.sol";

contract Trustified is ERC721URIStorage, ReentrancyGuard {
    uint256 listingPrice = 0 ether;
    address private issuernftaddress;

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _eventIdCounter; // Counter for event id which issuer will create.

    address[] public owners;
    mapping(address => bool) public isOwner;
    uint public numConfirmationsRequired;

    event TokensCreated(
        uint256 indexed eventId,
        uint256[] tokenIds,
        address indexed issuer
    );

    event SubmitTransaction(
        address indexed owner,
        uint indexed txIndex,
        address indexed to,
        uint amount
    );

    constructor(
        address _issuernftaddress,
        address[] memory _owners, 
        uint _numConfirmationsRequired
    ) ERC721("Trustifiedv5", "TFDv5") {
        issuernftaddress = _issuernftaddress;
        require(_owners.length > 0, "owners required");
        require(
            _numConfirmationsRequired > 0 &&
                _numConfirmationsRequired <= _owners.length,
            "invalid number of required confirmations"
        );

        for (uint i = 0; i < _owners.length; i++) {
            address owner = _owners[i];

            require(owner != address(0), "invalid owner");
            require(!isOwner[owner], "owner not unique");

            isOwner[owner] = true;
            owners.push(owner);
        }

        numConfirmationsRequired = _numConfirmationsRequired;
        
    }

    struct token {
        uint256 tokenId;
        address payable creator;
        bool nonTransferable;
        bool mintStatus;
    }

    struct Transaction {
        address to;
        uint amount;
        bool executed;
        uint numConfirmations;
    }

    mapping(uint256 => token) private tokens;
    mapping(uint256 => uint256[]) private eventTokens;
    mapping(uint => mapping(address => bool)) public isConfirmed;

    Transaction[] public transactions;

    modifier onlyOwner() {
        require(isOwner[msg.sender], "not owner");
        _;
    }

    modifier txExists(uint _txIndex) {
        require(_txIndex < transactions.length, "tx does not exist");
        _;
    }

    modifier notExecuted(uint _txIndex) {
        require(!transactions[_txIndex].executed, "tx already executed");
        _;
    }

    modifier notConfirmed(uint _txIndex) {
        require(!isConfirmed[_txIndex][msg.sender], "tx already confirmed");
        _;
    }

   

    function updateListingPrice(uint256 _listingPrice) external onlyOwner {
        listingPrice = _listingPrice;
    }
    
    
    /**
     * @param quantity Number of nft needs to be minted for particular event Id.
     * @param nonTransferable token should be transferable or nonTransferable.
     */
    function bulkMintERC721(uint256 quantity, bool nonTransferable)
        external
        payable
        nonReentrant
    {
        ERC721 nftContract = ERC721(issuernftaddress);
        require(
            nftContract.balanceOf(msg.sender) > 0,
            "You don't have Issuer nft!"
        );
        require(
            msg.value == listingPrice * quantity,
            "Price must be equal to listing price"
        );
        require(quantity > 0, "Invalid quantity"); // validate quantity is a non-zero positive integer
        uint256 eventId = _eventIdCounter.current();
        _eventIdCounter.increment();
        uint256[] memory tokenIds = new uint256[](quantity);
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _tokenIdCounter.current();
            _tokenIdCounter.increment();
            tokens[tokenId] = token(
                tokenId,
                payable(msg.sender),
                nonTransferable,
                false
            );
            tokenIds[i] = tokenId;
            eventTokens[eventId].push(tokenId);
        }
        if (tokenIds.length == quantity) {
            emit TokensCreated(eventId, tokenIds, msg.sender);
        }
        payable(address(this)).transfer(listingPrice * quantity);
    }

    function _beforeTokenTransfer(
        address from,
        address,
        uint256 firstTokenId,
        uint256
    ) internal virtual override {
        if (from != address(0)) {
            require(
                tokens[firstTokenId].nonTransferable != true,
                "Not allowed to transfer token"
            );
        }
    }

    /**
     * @param tokenURI Metadata of nft.
     * @param tokenId tokenId of token to be minted
     * @param to address of claimer.
     */
    function safeMint(
        string calldata tokenURI,
        uint256 tokenId,
        address to
    ) external {
        require(
            tokens[tokenId].mintStatus == false,
            "This token is already minted!"
        );
        _mint(to, tokenId);
        require(bytes(tokenURI).length > 0, "Token URI must not be empty");
        _setTokenURI(tokenId, tokenURI);
        tokens[tokenId].mintStatus = true;
    }

    function airdropnfts(
        address[] calldata wallets,
        uint256 eventId,
        string calldata tokenURI
    ) external {
        require(
            wallets.length == eventTokens[eventId].length,
            "Number of tokenIds and collectors of this event should be same!"
        );
        uint256[] memory tokenIds = eventTokens[eventId];
        for (uint256 i = 0; i < tokenIds.length; i++) {
            require(
                tokens[tokenIds[i]].mintStatus == false,
                "This token is already minted!"
            );
            _mint(wallets[i], tokenIds[i]);
            require(bytes(tokenURI).length > 0, "Token URI must not be empty");
            _setTokenURI(tokenIds[i], tokenURI);
            tokens[tokenIds[i]].mintStatus = true;
        }
    }


    function submitTransaction(
        address _to,
        uint _amount
    ) public onlyOwner {
        uint txIndex = transactions.length;

        transactions.push(
            Transaction({
                to: _to,
                amount: _amount,
                executed: false,
                numConfirmations: 0
            })
        );

        emit SubmitTransaction(msg.sender, txIndex, _to, _amount);
    }


    function confirmTransaction(
        uint _txIndex
    ) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) notConfirmed(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];
        transaction.numConfirmations += 1;
        isConfirmed[_txIndex][msg.sender] = true;
    }

    function withdrawFunds(
        uint _txIndex
   
    ) public onlyOwner txExists(_txIndex) notExecuted(_txIndex) {
        Transaction storage transaction = transactions[_txIndex];
        payable(transaction.to).transfer(transaction.amount);
        require(
            transaction.numConfirmations >= numConfirmationsRequired,
            "cannot execute tx"
        );
        
        transaction.executed = true;
        
    }

    function getTransaction(
        uint _txIndex
    )
        public
        view
        returns (
            address to,
            uint amount,
            bool executed,
            uint numConfirmations
        )
    {
        Transaction storage transaction = transactions[_txIndex];

        return (
            transaction.to,
            transaction.amount,
            transaction.executed,
            transaction.numConfirmations
        );
    }
   

    function getContractBalance() external view returns(uint) {
        return address(this).balance;
    }

      // Function to receive Ether. msg.data must be empty
    receive() external payable {}
}
