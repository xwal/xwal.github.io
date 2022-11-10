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

#### 证明机制
以下步骤针对单一资产，多资产生成多份证明机制即可。
##### 步骤一 公布平台资产
平台公布资产的持币地址，证明其拥有的资产储备总额数量。

##### 步骤二 生成用户节点数据
平台根据用户的资产数据，通过如下步骤生成用户结点数据：
* 每个用户具有 `userid,amount`
* 通过算法为每个用户生成 `userid,amount,nonce,hashid`
hash函数为
```python
def hash_func(userid, nonce, amount):
    inputstr = userid + str(nonce) + str(amount)
    hashstr  = hashlib.sha256(inputstr.encode("utf-8"))
    hashid   = hashstr.hexdigest()[0:HASHLEN * 2]
    return hashid
```
系统根据展示需求，可以选取部分hash值截断展示（本函数中，`HASHLEN=8`）。

* 通过算法根据用户节点生成平衡的Merkle树，非平衡的结点进行零资产结点填充。
以BTC资产为例，图中数量单位为聪，资产Merkle树类似的结构如下：
![merkle](merkle-por.png)

#### 步骤三 用户验证资产
* 用户可以下载平台完整的平衡Merkle树数据。
* 首先验证平台公布的持币地址资产是否大于等于Merkle资产树的根结点数字资产数量，如果大于等于，则证明平台拥有大于等于100%的用户储备金。
* 用户可以根据app端展示的nonce等相关数据，按照上述描述的hash函数，自行计算hashID，然后在平衡Merkle树中自行搜索查找叶子结点，证明用户资产在平台公布的储备数字资产中。
* 用户可以公布上述过程与数据。

所有用户都可以采用上述流程进行验证。
* 所有用户都能确认自己的资产数目在平台公布的储备资产数据中。
* 没有任何用户提出资产数据被重复验证或者伪造。
* 在上述两点满足的情况下，通过上述步骤即可证明平台拥有100%储备数字资产。

#### 用户验证示例

如果用户在平台中，有一定数量的BTC，那么用户可以验证自己的BTC百分百资产证明。

##### 用户打开平台 App，获取自己的用户ID(UID)、随机数(Nonce)、余额(Amount)。

- UID: 1563256765354 ==> 1563256765354
- Nonce: 19039 ==> 19039
- Amount: 0.13991643 ==> 13991643

**注意：BTC币种的平台精度是10^8 = 100000000，所以计算 0.13991643 * 10^8 = 13991643**

##### 计算字符串= str(UID) + str(Nonce) + str(Amount)

字符串 = "1563256765354" + "13974" + "13991643"
       = "15632567653541903913991643"

##### 计算hash值

hash计算采用SHA256算法。

SHA256("15632567653541903913991643") = 90d404dfaad97c23c2df3f1234d774dc88626825c4badc38b906e74df16e56b8

取前16个字符，故用户HASH = 90d404dfaad97c23

**注意：结果不区分大小写（90d404dfaad97c23 和 90D404DFAAD97C23 是一样的）**

##### 在Merkle Tree中查找用户HASH

```
Level,Number,Amount,Hash
0,0,1.91752000,eba80bc08c79d106
0,1,47.94822258,ee350eea6f8cb492
0,2,0.00054241,0d0a4c548f50dc0f
0,3,0.00152490,802f09fc23f90418
0,4,0.11042455,30a1681b474a98cb
0,5,0.10482076,add3d0d3fc1f86b5
0,6,0.00558000,1f1a4a83c896a74a
0,7,0.19614663,0d122b896db2a3d2
0,8,0.95972872,1aa46995b911a072
0,9,0.00066497,924c84586d6ca305
0,10,0.05185066,31b6e65f5fb3eaee
0,11,283.97299139,5a1b487021bb9eab
0,12,0.00000239,f2333a1e42a586d3
0,13,0.00000024,69ed031686af93da
0,14,0.00834000,6d3f2e89b0125a0d
0,15,1.24884468,29b4a398123cb0e7
## 在这里 ##
0,16,0.13991643,90d404dfaad97c23
0,17,0.13252314,acdb92f515bef17e
0,18,4.00350239,cf36f3061133fc62
0,19,0.12932834,54ee2ba25591eb90
0,20,0.06461708,cca2b192d0d63302
0,21,0.00227000,02759e7972e79550
0,22,0.03963867,bf68c210400a3312
0,23,0.03366789,7f0bf2b94f03898e
0,24,177.03102948,6551016b5dcf36e7
0,25,0.00000481,36c32980082316db
0,26,0.00000789,ec59240a475879f7
0,27,1.19111166,77aa7b923c1b3138
0,28,0.04801322,bcbe16ad3790c0c6
0,29,0.21463450,5d67e5c769ac58b6
0,30,35.29639568,44535df6e4664445
0,31,1.02122205,a410e18cb5e066de
0,32,0.51984214,bd600e3baca65f92
0,33,0.00000883,2802427b1d68b499
0,34,0.04932213,51cc039b07c6cc81
0,35,0.00573294,73a7c5ae8f741815
0,36,10.13089000,9543948400babc5c
。。。
。。。
 
```

在Merkle Tree中找到该用户(90d404dfaad97c23)

```
0,16,0.13991643,90d404dfaad97c23          
```
位于Merkle树叶子层，位置为16，余额为0.13991643

证毕。

#### 相关平台

1. [Kraken 做出了解释](https://www.kraken.com/zh-cn/proof-of-reserves)
2. [CEX的梅克尔树储备证明是什么？](https://medium.com/@asteacherluo/%E4%BA%A4%E6%98%93%E6%89%80%E7%9A%84%E6%A2%85%E5%85%8B%E5%B0%94%E6%A0%91%E5%82%A8%E5%A4%87%E8%AF%81%E6%98%8E%E6%98%AF%E4%BB%80%E4%B9%88-%E4%BA%A4%E6%98%93%E6%89%80%E7%9A%84%E6%A2%85%E5%85%8B%E5%B0%94%E6%A0%91%E5%82%A8%E5%A4%87%E8%AF%81%E6%98%8E%E6%98%AF%E4%BB%80%E4%B9%88-%E4%BA%A4%E6%98%93%E6%89%80%E7%9A%84%E6%A2%85%E5%85%8B%E5%B0%94%E6%A0%91%E5%82%A8%E5%A4%87%E8%AF%81%E6%98%8E%E6%98%AF%E4%BB%80%E4%B9%88-64b1a41fd6b7)