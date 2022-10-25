title: 使用 web3.py 扫描 ENS 域名
date: 2022-05-05 20:25:20
updated: 2022-05-05 20:25:20
tags:
- ENS
categories: Web3
---

最近 ENS 大火，数字域名成了抢手货，10k Club 已经被注册完了，接下来战场来到了 100K Club。

为了能够扫描到还有哪些 ENS 域名未注册，我们需要一个工具。

首选的工具肯定是 [web3.py](https://github.com/ethereum/web3.py)，它是一个 Python 库，可以用来扫描 ENS 域名。

具体操作如下：

### 安装 web3.py

打开帮助文档[快速开始](https://web3py.readthedocs.io/en/latest/quickstart.html)

```python
pip install web3
```

### 注册 Infura

由于我们需要访问 Ethereum 主网，所以需要配置 Web3 的 RPC 地址。前往 [Infura](https://infura.io/) 注册自己的账户，然后在页面右上角复制地址。

### 使用 Web3

```python
from web3 import Web3
from ens import ENS

w3 = Web3(Web3.HTTPProvider('https://<your-provider-url>'))
# w3 = Web3(Web3.WebsocketProvider('wss://<your-provider-url>'))
ens = ENS.fromWeb3(w3)

owner = ens.owner('xwaer.eth')
print(owner)
```
填写你的 Infura 地址，然后执行代码，查看结果。

这个时候会返回这个 ENS 的 owner 地址。

如果需要 ENS 的更多方法，可以查看 [ENS API](https://web3py.readthedocs.io/en/latest/ens.html)。

### 扫描 ENS 域名

这里我以扫描100k 以内的质数为例。

```python
from web3 import Web3
from ens import ENS
import time
import os

w3 = Web3(Web3.HTTPProvider('https://<your-provider-url>'))
# w3 = Web3(Web3.WebsocketProvider('wss://<your-provider-url>'))
ens = ENS.fromWeb3(w3)

owner = ens.owner('xwaer.eth')
print(owner)

origin_file = open("primes-to-100k.txt")
unavailable_file = open("unavailable.txt", "a+")
available_file = open("available.txt", "a+")
line = origin_file.readline()
while line:
    print(line)
    line = line.strip()
    owner = ens.owner(line + '.eth')
    if owner == '0x0000000000000000000000000000000000000000':
        available_file.write(line + '\n')
    else:
        unavailable_file.write(line + '\t' + owner + '\n')
    os.sync()
    time.sleep(0.1)
    line = origin_file.readline()
```
判断是否注册可以判断 owner 是否为 `0x0000000000000000000000000000000000000000` 地址。