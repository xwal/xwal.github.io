title: iOS 持续集成
date: 2016-09-26 23:00:51
updated: 2016-09-26 23:00:51
tags:
- TravisCI
- Jenkins
categories: iOS
---

**更新日志**

持续集成主要有两大好处：一是省去手动构建部署的繁琐，二是每一个提交都有自动跑测试保证质量。

本文主要介绍两大持续集成工具：TravisCI 和 Jenkins。

## TravisCI

Travis CI 可以和 Github 无缝集成，每次push都可以触发相应的操作，跑测试、自动部署都能完成。

