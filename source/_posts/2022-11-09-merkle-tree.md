title: 默克尔树（Merkle Tree）
date: 2022-11-09 16:09:47
updated: 2022-11-09 16:09:47
tags:
- exchange
- cryptography
categories: Web3
---

## 默克尔树

默克尔树结构用很小的成本就能有效验证数据集的完整性。

### 什么是Merkle树？

默克尔树是一种树状结构，树上的每个节点都由一个值表示，这个值是一些加密哈希函数的结果。哈希函数是单向的，从一个输入产生一个输出很容易，但从一个输出确定一个输入在计算上是不可行的。默克尔树有3种类型的节点，如下所示：

* 叶子节点 - 叶子节点位于树的最底部，它们的值是原始数据根据指定的哈希函数进行哈希的结果。一棵树上有多少个叶子节点，就有多少个需要哈希的原始数据。例如，如果有7个数据需要被哈希，就会有7个叶子节点。

* 父节点 - 父节点可以位于树的不同层次，这取决于整个树的大小，父节点总是位于叶节点之上。父节点的值是由它下面的节点的哈希值决定的，通常从左到右开始。由于不同的输入总是会产生不同的哈希值，不考虑哈希值的碰撞，节点哈希值的连接顺序很重要。值得一提的是，根据树的大小，父节点可以Hash其他父节点。

* 根节点 - 根节点位于树的顶端，由位于它下面的两个父节点的哈希值连接而成，同样从左到右开始。任何默克尔树上都只有一个根节点，根节点拥有根哈希值。

![默克尔树结构](2880.webp)

<!--more-->

Visualization of Merkle Tree

![Merkle Tree](43616375-15330c32-9671-11e8-9057-6e61c312c856.png)

Visualization of Merkle Tree Proof

![Merkle Tree Proof](43616387-27ec860a-9671-11e8-9f3f-0b871a6581a6.png)

Visualization of Invalid Merkle Tree Proofs

![Merkle Tree Proof](43616398-33e20584-9671-11e8-9f62-9f48ce412898.png)

Visualization of Bitcoin Merkle Tree

![Merkle Tree Proof](43616417-46d3293e-9671-11e8-81c3-8cdf7f8ddd77.png)

### Merkle 树实现（JavaScript）

#### 安装

官方库地址：https://github.com/merkletreejs/merkletreejs

安装

```shell
npm install merkletreejs
```

### 构建树

```javascript
const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')

const leaves = ['a', 'b', 'c'].map(x => SHA256(x))
const tree = new MerkleTree(leaves, SHA256)
const root = tree.getRoot().toString('hex')
console.log(tree.toString())
console.log(root)
```

1. 衍生出我们的叶子节点。在一棵树上位于叶子节点正上方的每个父节点，最多只能Hash两个叶子节点。如果叶子节点的数量不均匀，父节点将处理一个叶子节点。每个叶子节点应该是某种形式的Hash数据，我们这里使用sha256来哈希所有数据。
2. 对所有数据进行了哈希后，从而获得了我们的叶子节点 leaves，现在就可以创建Merkle树对象。我们使用merkletreejs库，通过调用new MerkleTree()函数，将叶子节点作为第一个参数，哈希算法作为第二个参数。
3. 现在已经得出了一个完整的Merkle树，可以通过调用Merkle树对象的getRoot()方法来获得根哈希值。记住，Merkle树的根哈希值是树上根节点正下方的两个前面的父节点的哈希值。

Merkle树的巧妙之处在于，它不需要任何关于原始数据块的知识来验证一个节点是否属于我们的树。如果我们试图验证一个叶子节点属于我们的树，只需要知道直接相邻的叶子节点哈希值(如果有的话)，以及叶子节点正上方相邻的父节点哈希值就可以了。这个信息被称为proof。

### 生成证明和验证

```javascript
const leaf = SHA256('a')
const proof = tree.getProof(leaf)
console.log(tree.verify(proof, leaf, root)) // true

const verified = MerkleTree.verify(proof, leaf, root, SHA256)
console.log(verified)
```

现在我们有了Merkle树对象和它的根哈希值，我们准备开始考虑如何提供Merkle证明。

1. 被验证方提供数据 `a` ，验证方收到数据后，使用 SHA256 进行哈希，并使用Merkle Tree对象上的getProof()方法检索证明。
2. 被验证方获取 `proof`、`leaf` 和 `root`后就可以通过 MerkleTree 的方法验证。

### 验证失败情况
如果一个无效数据试图使用有效或无效的证明来调用这个函数，生成的目标叶子节点将根本不存在于我们的Merkle树上，验证将失败。
1. 当使用无效数据生成 proof 时，在我们的 Merkle 树无法获取到 proof。
2. 当使用无效的数据，提供其他有效数据生成proof时，也无法通过验证。

```javascript
const badLeaves = ['a', 'x', 'c'].map(x => SHA256(x))
const badTree = new MerkleTree(badLeaves, SHA256)
const badLeaf = SHA256('x')
const badProof = badTree.getProof(badLeaf)
console.log(badTree.verify(badProof, badLeaf, root)) // false
```

## 应用

### NFT 白名单

#### 后端实现
```javascript
const { MerkleTree } = require('merkletreejs')
const keccak256 = require('keccak256')

const whitelist = [
    '0x7a68Ab63Ba083916a1e4875588b61676F52Bd08b',
    '0x9e1D367A900bc7103e3f2f2af9B71ae9d29a3e58',
    '0x5191c9832B5bf6512F7216eE24cc0Ba44558993F',
    '0xdd9c4E0B11c319E980c00773296fc1bA6e3D3d23',
    '0xC4282694CE35e1b2DD7823BBF3693cfe1E99c398'
]
const leaves = whitelist.map(addr => keccak256(addr))
const tree = new MerkleTree(leaves, keccak256)
const root = tree.getHexRoot()
console.log(tree.toString())
console.log(root)
```
发行方通过收集白名单用户地址，生成 root 哈希根。

#### 前端实现

```javascript
const leaf = keccak256('0x7a68Ab63Ba083916a1e4875588b61676F52Bd08b')
const proof = tree.getProof(leaf)
console.log(tree.getHexProof(leaf))
const verified = MerkleTree.verify(proof, leaf, root, keccak256)
console.log(verified)
```

前端用户连接上钱包后，通过 API 将钱包地址发往后端，并返回指定的证明 proof。注意钱包地址的大小写。
前端通过 MerkleTree.verify 就可以验证。

#### 合约实现

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract Merkle {
    bytes32 public merkleRoot = 0x2800cfa9f59cf71c57b9f8b5641b745583ef2161b84fba14d823ac3449549976;
    
    mapping(address => bool) public whitelistClaimed;

    function whitelistMint(bytes32[] calldata _merkleProof) public {
        require(!whitelistClaimed[msg.sender], "Address has already claimed.");
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
        require(MerkleProof.verify(_merkleProof, merkleRoot, leaf), "Invalid proof.");
        whitelistClaimed[msg.sender] = true;
    }
}
```

### 准备金证明（Proof of Reserves）

Kraken 做出了解释： https://www.kraken.com/zh-cn/proof-of-reserves