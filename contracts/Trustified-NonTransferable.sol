// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./comman/FERC721URIStorage.sol";

contract TrustifiedNonTransferable is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;
    Counters.Counter private _eventIdCounter;

    mapping(uint256 => uint256[]) public tokenIds;

    mapping(uint256 => bool) private transferStatus;

    event TokenMinted(address, uint256);

    constructor() ERC721("Trustified", "TFN") {}

    function safeMint(
        string calldata tokenURI,
        uint256 value
    ) public returns (uint256) {
        require(value >= 0 && value <= 1, "Invalid value");
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _mint(address(this), tokenId);
        if (value == 0) {
            _setTokenURI(tokenId, tokenURI);
        }
        return tokenId;
    }

    function bulkMintERC721(
        string calldata tokenUri,
        uint256 quantity,
        uint256 value
    ) external {
        uint256 eventId = _eventIdCounter.current();
        _eventIdCounter.increment();
        for (uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = safeMint(tokenUri, value);
            tokenIds[eventId].push(tokenId);
        }
        emit TokenMinted(msg.sender, eventId);
    }

    function getTokenIds(
        uint256 eventId
    ) external view returns (uint256[] memory) {
        return tokenIds[eventId];
    }

    function transferToken(
        address from,
        address to,
        uint256 tokenId,
        string calldata tokenURI,
        uint256 value
    ) external {
         require(value >= 0 && value <= 1, "Invalid value");
        require(
            transferStatus[tokenId] != true,
            "This token can not be transferred!"
        );
        if(value == 1){
            _setTokenURI(tokenId, tokenURI);
        }
        IERC721(address(this)).transferFrom(from, to, tokenId);
        transferStatus[tokenId] = true;
    }
}
