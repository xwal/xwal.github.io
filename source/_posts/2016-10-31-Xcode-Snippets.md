title: Xcode Snippets（代码片段）
date: 2016-10-31 11:35:24
updated: 2016-10-31 11:35:24
tags:
- Tools
- Xcode
categories: iOS
---

**更新日志**

关于 **Xcode Snippets** 的介绍，可以通过[这篇文章](http://nshipster.cn/xcode-snippets/)了解，以及如何生成自定义的代码片段。

## 安装 NShipster 提供的代码片段

仓库地址：<https://github.com/Xcode-Snippets>

1. 安装命令行工具：`gem install xcodesnippet`
2. 下载代码仓库：`git clone https://github.com/Xcode-Snippets/Objective-C.git`
3. 进入该目录添加单条代码片段：`xcodesnippet install path/to/source.m`
4. 该目录下有很多代码片段，可以通过命令批量添加：`ls -1 | xargs -L1 xcodesnippet install`

## 安装唐巧提供的代码片段

仓库地址：<https://github.com/tangqiaoboy/xcode_tool>

1. 下载项目仓库：`git clone https://github.com/tangqiaoboy/xcode_tool`
2. `cd xcode_tool`
3. `./setup_snippets.sh`

需要注意的是唐巧提供的代码片段，以后需要更新时可以直接仓库即可。


