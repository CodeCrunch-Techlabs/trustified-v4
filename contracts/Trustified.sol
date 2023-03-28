// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./comman/ERC721URIStorage.sol";

contract Trustified is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _eventIdCounter; // Counter for event id which issuer will create.

    bool public allTokenMinted;

    mapping(uint256 => uint256[]) public tokenIds; // Every event Id will have list of tokenIds.
    mapping(uint256 => address) public issuers; // To get the issuer address from the event Id.
    mapping(uint256 => bool) private _nonTransferable; // TokenId with the bool value which defines if token is tranferable or non-tranferable.

    event TokenMinted(address, uint256);

    constructor() ERC721("ItsTrustified", "ITF") {}

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
    ) external {
        require(quantity > 0, "Invalid quantity"); // validate quantity is a non-zero positive integer
        require(value >= 0 && value <= 1, "Invalid value");
        uint256 eventId = _eventIdCounter.current();
        _eventIdCounter.increment();
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = safeMint(tokenUri, value);
            tokenIds[eventId].push(tokenId);
            issuers[eventId] = msg.sender;
            _nonTransferable[tokenId] = nonTransferable;
            uint256 totalMinted = tokenId + 1;
            if (totalMinted == quantity) {
                allTokenMinted = true;
            }
        }
        emit TokenMinted(msg.sender, eventId);
    }

    function getMintStatus() external view returns (bool) {
        return allTokenMinted;
    }

    /**
     * @dev Function to get tokenIds minted for particular event Id.
     * @param eventId event Id created during mint.
     */
    function getTokenIds(
        uint256 eventId
    ) external view returns (uint256[] memory) {
        return tokenIds[eventId];
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override {
        if (from != address(this)) {
            require(
                _nonTransferable[firstTokenId] != true,
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
    ) external {
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
