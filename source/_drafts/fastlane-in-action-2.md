title: Fastlane 实践（二）：将Fastlane作为服务
tags:
- fastlane
- ci

categories: iOS

---

[上一篇文章](https://chaosky.tech/2020/05/04/fastlane-in-action-1/)讲了下Fastlane的基本用法，接下来将讲下 Fastlane 做为 Web 服务的一部分在后台运行，作为工具链体系的一环，连接不同的服务。

## 0x01 Fastlane 代码结构

首先，我们来剖析下 [Fastlane](https://github.com/fastlane/fastlane) 的代码结构：

```
....
├── bin
├── cert
├── credentials_manager
├── deliver
├── fastlane
├── fastlane_core
├── frameit
├── gym
├── match
├── pem
├── pilot
├── precheck
├── produce
├── rakelib
├── rubocop
├── scan
├── screengrab
├── sigh
├── snapshot
├── spaceship
├── supply
....
```
