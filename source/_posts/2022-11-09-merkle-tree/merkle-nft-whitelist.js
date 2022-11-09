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

const leaf = keccak256('0x7a68Ab63Ba083916a1e4875588b61676F52Bd08b')
const proof = tree.getProof(leaf)
console.log(tree.getHexProof(leaf))
const verified = MerkleTree.verify(proof, leaf, root, keccak256)
console.log(verified)