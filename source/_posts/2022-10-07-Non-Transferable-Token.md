title: 实现无法交易转账的Token
date: 2022-10-07 20:08:44
updated: 2022-10-07 20:08:44
tags:
- Solidity
categories: Web3
---

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Xwal is ERC721, Ownable {
    error NonTransferableToken();

    constructor() ERC721("xwal", "xwalNFT") {}

    function _baseURI() internal pure override returns (string memory) {
        return "https://arweave.net/E7rz7sKa1wWxKlMeFVrtZHgRjGMdDadDkT4QF2vDDkw/";
    }

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) override internal virtual {
        if (from != address(0) && to != address(0)) {
            revert NonTransferableToken();
        }
    }
}
```
覆盖 _beforeTokenTransfer 方法即可。
