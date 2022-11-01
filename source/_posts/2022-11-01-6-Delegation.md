title: 6. Delegation
date: 2022-11-01 17:34:48
updated: 2022-11-01 17:34:48
tags:
- ethernaut
categories: Web3
---

Chain: Goerli
Difficulty: ●●○○○
Level: https://ethernaut.openzeppelin.com/level/0x31C4D3a9e0ED12A409cF3C84ad145331aB487D3F

### 要求

这一关的目标是申明你对你创建实例的所有权.

这可能有帮助

- 仔细看solidity文档关于 `delegatecall` 的低级函数, 他怎么运行的, 他如何将操作委托给链上库, 以及他对执行的影响.
- Fallback 方法
- 方法 ID

### 分析

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Delegate {

  address public owner;

  constructor(address _owner) public {
    owner = _owner;
  }

  function pwn() public {
    owner = msg.sender;
  }
}

contract Delegation {

  address public owner;
  Delegate delegate;

  constructor(address _delegateAddress) public {
    delegate = Delegate(_delegateAddress);
    owner = msg.sender;
  }

  fallback() external {
    (bool result,) = address(delegate).delegatecall(msg.data);
    if (result) {
      this;
    }
  }
}
```

首先我们根据解题提示和分析合约，有3个知识点。以下内容引用自：[WTF Academy](https://wtf.academy/)

#### `delegatecall` 和 `call`

`delegatecall`与`call`类似，是`solidity`中地址类型的低级成员函数。

当用户`A`通过合约`B`来`call`合约`C`的时候，执行的是合约`C`的函数，`语境`(`Context`，可以理解为包含变量和状态的环境)也是合约`C`的：`msg.sender`是`B`的地址，并且如果函数改变一些状态变量，产生的效果会作用于合约`C`的变量上。

![](call.png)

而当用户`A`通过合约`B`来`delegatecall`合约`C`的时候，执行的是合约`C`的函数，但是`语境`仍是合约`B`的：`msg.sender`是`A`的地址，并且如果函数改变一些状态变量，产生的效果会作用于合约`B`的变量上。

![](delegatecall.png)

大家可以这样理解：一个`富商`把它的资产（`状态变量`）都交给一个`VC`代理（`目标合约`的函数）来打理。执行的是`VC`的函数，但是改变的是`富商`的状态。

`delegatecall`语法和`call`类似，也是：

```
目标合约地址.delegatecall(二进制编码);
```

其中`二进制编码`利用结构化编码函数`abi.encodeWithSignature`获得：

```
abi.encodeWithSignature("函数签名", 逗号分隔的具体参数)
```

`函数签名`为`"函数名（逗号分隔的参数类型)"`。例如`abi.encodeWithSignature("f(uint256,address)", _x, _addr)`。

和`call`不一样，`delegatecall`在调用合约时可以指定交易发送的`gas`，但不能指定发送的`ETH`数额

> 注意：delegatecall有安全隐患，使用时要保证当前合约和目标合约的状态变量存储结构相同，并且目标合约安全，不然会造成资产损失。
> 
#### Fallback

`fallback()`函数会在调用合约不存在的函数时被触发。可用于接收ETH，也可以用于代理合约`proxy contract`。`fallback()`声明时不需要`function`关键字，必须由`external`修饰，一般也会用`payable`修饰，用于接收ETH:`fallback() external payable { ... }`。

我们定义一个`fallback()`函数，被触发时候会释放`fallbackCalled`事件，并输出`msg.sender`，`msg.value`和`msg.data`:

```solidity
// fallback
fallback() external payable{
    emit fallbackCalled(msg.sender, msg.value, msg.data);
}
```

#### 方法 ID

`ABI` (Application Binary Interface，应用二进制接口)是与以太坊智能合约交互的标准。数据基于他们的类型编码；并且由于编码后不包含类型信息，解码时需要注明它们的类型。

`Solidity`中，`ABI编码`有4个函数：`abi.encode`, `abi.encodePacked`, `abi.encodeWithSignature`, `abi.encodeWithSelector`。而`ABI解码`有1个函数：`abi.decode`，用于解码`abi.encode`的数据。

##### abi.encode

将给定参数利用[ABI规则](https://learnblockchain.cn/docs/solidity/abi-spec.html)编码。`ABI`被设计出来跟智能合约交互，他将每个参数填充为32字节的数据，并拼接在一起。如果你要和合约交互，你要用的就是`abi.encode`。

```solidity
function encode() public view returns(bytes memory result) {
    result = abi.encode(x, addr, name, array);
}
```

##### abi.encodePacked

将给定参数根据其所需最低空间编码。它类似 `abi.encode`，但是会把其中填充的很多`0`省略。比如，只用1字节来编码`uint`类型。当你想省空间，并且不与合约交互的时候，可以使用`abi.encodePacked`，例如算一些数据的`hash`时。

```solidity
function encodePacked() public view returns(bytes memory result) {
    result = abi.encodePacked(x, addr, name, array);
}
```

##### abi.encodeWithSignature

与`abi.encode`功能类似，只不过第一个参数为`函数签名`，比如`"foo(uint256,address)"`。当调用其他合约的时候可以使用。

```solidity
function encodeWithSignature() public view returns(bytes memory result) {
    result = abi.encodeWithSignature("foo(uint256,address,string,uint256[2])", x, addr, name, array);
}
```

等同于在`abi.encode`编码结果前加上了4字节的`函数选择器`。 说明: 函数选择器就是通过函数名和参数进行签名处理(Keccak–Sha3)来标识函数，可以用于不同合约之间的函数调用。

##### abi.encodeWithSelector

与`abi.encodeWithSignature`功能类似，只不过第一个参数为`函数选择器`，为`函数签名`Keccak哈希的前4个字节。

```solidity
function encodeWithSelector() public view returns(bytes memory result) {
    result = abi.encodeWithSelector(bytes4(keccak256("foo(uint256,address,string,uint256[2])")), x, addr, name, array);
}
```

我们再来分析下合约，就很明了。通过触发合约的 `fallback` 调用 `delegatecall` 执行 `pwn` 方法，就可以将合约的`owner`更改为 `player`。

### 解题

1. 首先打开Console，获取当前关卡合约实例地址 `contract`；
2. 执行JS，调用sendTransaction：
    
    ```jsx
    contract.sendTransaction({data: web3.eth.abi.encodeFunctionSignature('pwn()')});
    ```
    
3. 最后提交，本关完成。

### 后记

使用`delegatecall` 是很危险的，而且历史上已经多次被用于进行 attack vector。使用它，你对合约相当于在说 "看这里， 其他合约或是其它库，来对我的状态为所欲为吧"。代理对你合约的状态有完全的控制权。 `delegatecall` 函数是一个很有用的功能，但是也很危险，所以使用的时候需要非常小心。

请参见 [The Parity Wallet Hack Explained](https://blog.openzeppelin.com/on-the-parity-wallet-multisig-hack-405a8c12e8f7) 这篇文章, 他详细解释了这个方法是如何窃取三千万美元的。