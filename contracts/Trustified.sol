// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./comman/ERC721URIStorage.sol";

contract Trustified is ERC721URIStorage, ReentrancyGuard {
    using SafeMath for uint256;
    address payable public owner;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _eventIdCounter; // Counter for event id which issuer will create.

    event TokensMinted(
        uint256 indexed eventId,
        uint256[] tokenIds,
        address indexed issuer
    );

    constructor() ERC721("TrustifiedTest", "TFT") {
        owner = payable(msg.sender);
    }

    struct token {
        uint256 tokenId;
        address payable creator;
        address payable owner;
        bool nonTransferable;
    }

    mapping(uint256 => token) private tokens;

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
     */
    function bulkMintERC721(
        string calldata tokenUri,
        uint256 quantity,
        uint256 value,
        bool nonTransferable
    ) external nonReentrant {
        require(quantity > 0, "Invalid quantity"); // validate quantity is a non-zero positive integer
        require(value >= 0 && value <= 1, "Invalid value");
        uint256 eventId = _eventIdCounter.current();
        _eventIdCounter.increment();
        uint256[] memory tokenIds = new uint256[](quantity);
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = safeMint(tokenUri, value);
            tokens[tokenId] = token(
                tokenId,
                payable(msg.sender),
                payable(msg.sender),
                nonTransferable
            );
            tokenIds[i] = tokenId;
        }
        if (tokenIds.length == quantity) {
            emit TokensMinted(eventId, tokenIds, msg.sender);
        }
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override {
        if (from != address(this)) {
            require(
                tokens[firstTokenId].nonTransferable != true,
                "Not allowed to transfer token"
            );
        }
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
    ) external nonReentrant {
        require(value >= 0 && value <= 1, "Invalid value");
        if (value == 1) {
            _setTokenURI(tokenId, tokenURI);
        }
        if (from != address(this)) {
            require(
                _isApprovedOrOwner(msg.sender, tokenId),
                "ERC721: transfer caller is not owner nor approved"
            );
            _transfer(_msgSender(), to, tokenId);
        } else {
            _transfer(from, to, tokenId);
        }
    }
}
