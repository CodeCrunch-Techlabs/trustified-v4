// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "../comman/ERC721URIStorage.sol";

contract TrustifiedTransferable is ERC721URIStorage, ReentrancyGuard {
    using SafeMath for uint256;
    address payable public owner;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _eventIdCounter; // Counter for event id which issuer will create.

    uint256 public creationFees = 0.001 ether;
    uint256 public claimFees = 20;

    event TokensMinted(uint256 indexed eventId, uint256[] tokenIds, address indexed issuer);

    constructor() ERC721("Trustified1", "TF1") {
       owner = payable(msg.sender);
    }

    struct token {
    uint256 tokenId;
    address payable creator;
    uint256 price;
  }

    mapping(uint256 => token) private tokens;

    modifier onlyOwner() {
       require(msg.sender == owner, "Only the contract owner can call this function.");
       _;
    }

    function setCreationFees(uint256 _creationFees) public onlyOwner {
        creationFees = _creationFees;
    }
    
    function setClaimFees(uint256 _claimFees) public onlyOwner {
        require(_claimFees <= 100, "Invalid claim amount");
        claimFees = _claimFees;
    }

    /**
     * @dev value == 0 is for to check the nft we are minting is for certificate or badges. For badges we set tokenURI in mint.
     * @param tokenURI Metadata of nft.
     * @param value 0 means it's Badges and 1 means it's certificates.
     */
    function safeMint(
        string calldata tokenURI,
        uint256 value
    ) internal returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(address(this), tokenId);
        if (value == 0) {
            require(bytes(tokenURI).length > 0, "Token URI must not be empty");
            _setTokenURI(tokenId, tokenURI);
        }
        return tokenId;
    }

    /**
     * @param tokenUri Metadata of nft.
     * @param quantity Number of nft needs to be minted for particular event Id.
     * @param value 0 means it's Badges and 1 means it's certificates.
    * @param price Price of nft.
     */
    function bulkMintERC721(
        string calldata tokenUri,
        uint256 quantity,
        uint256 value,
        uint256 price
    ) external payable nonReentrant {
        require(quantity > 0, "Invalid quantity"); // validate quantity is a non-zero positive integer
        require(value >= 0 && value <= 1, "Invalid value");
        require(msg.value == creationFees, "Amount must be equal to creation fees");
        uint256 eventId = _eventIdCounter.current();
        _eventIdCounter.increment();
        uint256[] memory tokenIds = new uint256[](quantity);
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = safeMint(tokenUri, value);
             tokens[tokenId] =  token (
                           tokenId,
                           payable(msg.sender),
                           price
                    );
            tokenIds[i] = tokenId;
        }
        owner.transfer(msg.value);
        emit TokensMinted(eventId, tokenIds, msg.sender);
    }



    /**
     * @dev Function to claim nfts. Here if value == 1 which means we set the tokenURI for certificates nft in claim token(tranfer token)
     * @param from Address of nft owner.
     * @param to Address of nft receiver.
     * @param tokenId token Id of nft.
     * @param tokenURI Metadata of nft.
     * @param value 0 means it's Badges and 1 means it's certificates.
     */
    function transferToken(
        address from,
        address to,
        uint256 tokenId,
        string calldata tokenURI,
        uint256 value
    ) external payable nonReentrant{
        require(value >= 0 && value <= 1, "Invalid value");
        require(msg.value == tokens[tokenId].price, "Amount must be equal to price of token");
        if (value == 1) {
            _setTokenURI(tokenId, tokenURI);
        }
        if (from != address(this)) {
            require(
                _isApprovedOrOwner(msg.sender, tokenId),
                "ERC721: transfer caller is not owner nor approved"
            );
            _transfer(_msgSender(), to, tokenId);
            claimRoyality(tokenId);
        } else {
            _transfer(from, to, tokenId);
             claimRoyality(tokenId);
        }
    }

    function claimRoyality(uint256 tokenId) public payable{
            uint256 price = msg.value;
             uint256 claimFee = price.mul(claimFees).div(100);
             owner.transfer(claimFee);
             uint256 creatorFees  = price.sub(claimFee);
             payable(tokens[tokenId].creator).transfer(creatorFees); 
     }

 
}
