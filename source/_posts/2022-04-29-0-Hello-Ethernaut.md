title: 0. Hello Ethernaut
date: 2022-04-29 17:46:45
updated: 2022-04-29 17:46:45
tags:
- ethernaut
categories: Web3
---

**Difficulty**: 0/10
**Level**: https://ethernaut.openzeppelin.com/level/0x4E73b858fD5D7A5fc1c3455061dE52a53F35d966

本节主要就是一个新手教学，让人先了解游戏玩法及闯关模式，需要对 MetaMask、JavaScript、console等有基本了解。

打开 Developer Console (F12) ，输入

```jsx
player
```

会打印当前钱包地址。

依步骤了解指令用法，按 Get new instance 开始闯关。MetaMask 会弹出交易请求，确认以部署关卡合约，关卡正式开始。

打开 Developer Console (F12) ，依次输入:

```jsx
> await contract.info()
< "You will find what you need in info1()."

> await contract.info1()
< "Try info2(), but with "hello" as a parameter."

> await contract.info2("hello")
< "The property infoNum holds the number of the next info method to call."

> await contract.infoNum()
< BN {negative: 0, words: [42, empty], length: 1, red: null}

> await contract.info42()
< "theMethodName is the name of the next method."

> await contract.theMethodName()
< "The method name is method7123949."

> await contract.method7123949()
< "If you know the password, submit it to authenticate()."

> await contract.password()
< "ethernaut0"

> await contract.authenticate("ethernaut0")
```

最后会弹出一个 MetaMask 的交易请求，确认后再按 Submit instance，再确认后 Console 会弹出 “You have completed this level!!!” 即本关完成。