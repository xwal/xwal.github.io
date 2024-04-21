title: 深入研究 ERC-4337 智能合约
date: 2023-08-15 22:17:07
updated: 2023-08-15 22:17:07
tags:

- ethereum
categories:
- Web3
---
### A deep dive into ERC-4337 smart contracts & how to spin up smart wallets for your app's users:深入研究 ERC-4337 智能合约以及如何为应用程序的用户启动智能钱包：

By design, EOA wallets are limited in both features & flexibility. They can only perform 2 actions:
从设计上来说，EOA 钱包的功能和灵活性都受到限制。他们只能执行 2 个操作：

1. Transfer tokens to other EOAs
2. Initiate transactions that trigger another smart contract transaction

1. 将代币转移到其他EOA
2. 发起交易触发另一笔智能合约交易

These limitations present many challenges for users & developers:

这些限制给用户和开发人员带来了许多挑战：

### EOA disadvantages: EOA的缺点：

1. Security: Dependent on one seed phrase. No spend limits, social recovery options, 2FA 
2. Customization: Transactions from EOAs can't be customized/automated & must be manually signed
3. Gas: Must own ETH to pay for gas at all times, can't use other tokens

1. 安全性：依赖于一个助记词。无支出限制、社交恢复选项、2FA 
2. 定制：来自 EOA 的交易无法定制/自动化，必须手动签名 
3. Gas：必须始终拥有 ETH 来支付 Gas，不能使用其他代币

### So why smart wallets? 那么为什么是智能钱包呢？ 

As an individual, you may want to use a wallet with account recovery & multisig capability.

作为个人，您可能希望使用具有帐户恢复和多重签名功能的钱包。 

As a developer, you may want to issue wallets to your app's users with better UX: 'invisible wallets', gasless, batch txs... 

作为开发人员，您可能希望以更好的用户体验向应用程序的用户发行钱包：“隐形钱包”、无gas、批量交易...... 

But how do you put this into practice?

但如何将其付诸实践呢？