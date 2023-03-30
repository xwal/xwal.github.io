const { MerkleTree } = require('merkletreejs')
const SHA256 = require('crypto-js/sha256')

const leaves = ['a', 'b', 'c'].map(x => SHA256(x))
const tree = new MerkleTree(leaves, SHA256)
const root = tree.getHexRoot()
console.log(tree.toString())
console.log(root)

const leaf = SHA256('a')
const proof = tree.getProof(leaf)
console.log(tree.verify(proof, leaf, root)) // true
const verified = MerkleTree.verify(proof, leaf, root, SHA256)
console.log(verified)


const badLeaves = ['a', 'x', 'c'].map(x => SHA256(x))
const badTree = new MerkleTree(badLeaves, SHA256)
const badLeaf = SHA256('x')
const badProof = badTree.getProof(badLeaf)
console.log(badTree.verify(badProof, badLeaf, root)) // false