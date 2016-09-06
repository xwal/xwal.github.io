title: macOS 开发配置手册——工具篇
date: 2016-07-29 13:08:28
tags: 
- Setup Guide
- Tools
categories: macOS
---

**更新日志**

- 2016-08-05 添加node、Python等终端命令

> 工欲善其事，必先利其器。—— 工具篇

<!-- more -->

## 命令行工具
### Xcode Command Line Tools
从 App store 或苹果开发者网站安装 [Xcode](https://developer.apple.com/xcode/) 。  

紧接着，在终端中运行安装 **Xcode Command Line Tools**，执行命令：

```
$ xcode-select --install
```
### zsh

zsh的介绍可以查看池老师的文章[终极 Shell](http://macshuo.com/?p=676)

#### 切换zsh
切换当前用户的shell，执行命令：

```
$ chsh -s /bin/zsh
```

执行时会要求输入密码

#### 安装oh-my-zsh

Oh My Zsh 介绍

> Oh My Zsh is an open source, community-driven framework for managing your zsh configuration. That sounds boring. Let's try this again.
> Oh My Zsh is a way of life! Once installed, your terminal prompt will become the talk of the town or your money back! Each time you interact with your command prompt, you'll be able to take advantage of the hundreds of bundled plugins and pretty themes. Strangers will come up to you in cafés and ask you, "that is amazing. are you some sort of genius?" Finally, you'll begin to get the sort of attention that you always felt that you deserved. ...or maybe you'll just use the time that you saved to start flossing more often.

通过curl安装：

```
$ sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

#### 配置zsh

zsh 的配置主要集中在用户当前目录的.zshrc里，用 vim 或你喜欢的其他编辑器打开.zshrc，具体配置参见官方文档：<https://github.com/robbyrussell/oh-my-zsh>


### Homebrew

包管理工具可以让你安装和更新程序变得更方便，目前在 macOS 系统中最受欢迎的包管理工具是 Homebrew 。

#### 安装

在安装 Homebrew 之前，需要将 **Xcode Command Line Tools** 安装完成，这样你就可以使用基于 **Xcode Command Line Tools** 编译的 Homebrew。

在**终端**中执行以下命令，跟随指引，将完成 Hombrew 安装。

```
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)" 
```

检查brew是否运行正常：

```
$ brew doctor 
```

#### Homebrew 基本使用

安装程序包：

```
$ brew install <package_name>
```

更新本地Homebrew和程序包缓存：

```
$ brew update
```

更新程序包：
```
$ brew upgrade <package_name>
```

清除旧版程序包：

```
$ brew cleanup
```

查看已安装过的程序包列表：

```
$ brew list --versions
```

#### 常用程序包

```
$ brew install carthage
$ brew install cmake
$ brew install ffmpeg
$ brew install gdb			// GNU debugger
$ brew install git-flow	//
$ brew install jenkins
$ brew install llvm			// Next-gen compiler infrastructure
$ brew install node
$ brew install nvm
$ brew install rmtrash		// Move files to OS X's Trash
$ brew install rename		// Perl-powered file rename script with many helpful built-ins
$ brew install subversion
$ brew install swiftenv	// Swift version manager
$ brew install tldr			// 
$ brew install tree			//
$ brew install wget
$ brew install xctool
```

#### 安装Homebrew Cask
通过 Homebrew Cask 优雅、简单、快速的安装和管理 OS X 图形界面程序，比如 Google Chrome 和 Dropbox。

```
$ brew tap caskroom/cask  // 添加 Github 上的 caskroom/cask 库
$ brew install brew-cask  // 安装 brew-cask
$ brew cask install google-chrome // 安装 Google 浏览器
$ brew update && brew upgrade brew-cask && brew cleanup // 更新
```

##### 文件预览插件

有些 插件 可以让 Mac 上的文件预览更有效，比如语法高亮、markdown 渲染、json 预览等等。

```
$ brew cask install qlcolorcode
$ brew cask install qlstephen
$ brew cask install qlmarkdown
$ brew cask install quicklook-json
$ brew cask install qlprettypatch
$ brew cask install quicklook-csv
$ brew cask install betterzipql
$ brew cask install webp-quicklook
$ brew cask install suspicious-package
```

##### launchrocket
brew cask 安装 launchrocket，来管理通过 brew 安装的 service

```
$ brew cask install launchrocket
```

![Snip20160729_9](http://7xooko.com1.z0.glb.clouddn.com/2016-08-01-Snip20160729_9.png)

### RVM
Ruby版本管理器
> RVM is the Ruby enVironment Manager (rvm).
> It manages Ruby application environments and enables switching between them.

```
$ curl -sSL https://get.rvm.io | bash -s stable
$ source ~/.rvm/scripts/rvm
$ rvm install 2.3.0
$ rvm use 2.3.0
$ /bin/bash --login
```

#### gem

Ruby包管理器

```
$ gem install cocoapods
$ gem install fastlane
$ gem install octopress
$ gem install tty
```

### Python

Python 是一个高层次的结合了解释性、编译性、互动性和面向对象的脚本语言。

通过命令安装：

```
$ brew install python
```

通过以上命令搭建 python 环境，该命令会自动安装好 pip 和 setuptools。

#### pip & setuptools

pip 和 setuptools 是 Python 的包管理器。

更新 pip 和 setuptools 包管理器：

```
  pip install --upgrade pip setuptools
```

安装程序包：

```
  pip install <package>
```
安装位置：`/usr/local/lib/python2.7/site-packages`

#### 常用 Python 程序包

```
$ pip install beautifulsoup4 // HTML解析
$ pip install NetEase-MusicBox // 网易云音乐命令行版
$ pip install starred	// 利用GitHub上stars项目生成类 awesome 列表的汇总页面。
```

### Node

> Platform built on the V8 JavaScript runtime to build network applications.

简单的说 Node.js 就是运行在服务端的 JavaScript。

通过命令安装：

```
$ brew install node
```

通过以上命令搭建好 node.js 开发环境，同时也会安装 node 的包管理工具 npm。

#### npm

node 的包管理器。

安装 node 程序包有两种方式：

1. 安装在本地工程项目中，只能本地项目使用，安装命令如下：

```
$ npm install <package> --save
```

2. 安装为全局程序包，安装命令如下：

```
$ npm install -g <package>
```

#### 常用全局 npm 程序包

```
$ npm install -g hexo-cli	// 静态博客
$ npm install -g ionic		// Hybird 开发
$ npm install -g react-native-cli // React Native 开发
```

## GUI工具

### 常用工具

#### 替换系统默认终端 - iTerm 2

#### 中文输入法

推荐安装搜狗输入法。

#### 窗口管理软件 - SizeUp

#### 查找文件和应用程序 - Alfred

Alfred is an award-winning app for Mac OS X which boosts your efficiency with hotkeys, keywords, text expansion and more. Search your Mac and the web, and be more productive with custom actions to control your Mac.

#### 来杯免费咖啡 - Caffeine

你应该立刻安装这款免费的良心软件---Caffeine，设置开机启动，点一下状态栏的咖啡杯图标，当咖啡是满的时候，MacBook将不会进入休眠模式，再点一下咖啡杯空了就正常休眠，我默认设置开机启动，咖啡杯保持满满的状态。

#### 快速切换和打开应用程序 - Manico

MacBook系统默认设置了一个快捷键来显示当前运行中的应用程序，同时按下tab + command，将看到如下图的样式：

#### 随心所欲的复制粘贴 - PopClip

#### 增强资源管理器 - XtraFinder

#### 管理状态栏图标 - Bartender

#### 音乐播放器 - 网易云音乐

#### 词典 - 有道词典

#### 文本编辑 - Atom，Visual Studio Code

#### 文本比较 - Beyond Compare

#### 垃圾清理 - CleanMyMac 3

#### U盘启动制作 - DiskMaker X 5

#### 笔记 - Evernote

#### 屏幕颜色调整（保护眼睛）- Flux

#### 图床 - iPic

#### 系统监测 - iStat Menus

#### gif 录制 - licecap

#### Markdown - MacDown，MWeb，Typora

#### 思维导图 - MindNode，XMind

#### 视频播放 - MPlayerX

#### 流程图制作 - OmniGraffle

#### 绘图 - Paintbrush

#### 虚拟机 - Parallels Desktop，VirtualBox

#### 壁纸 - Pimp Your Screen

#### Mac版PhotoShop - Pixelmator

#### 稍候阅读 - Pocket

#### 番茄钟 - Pomodoro Time

#### 录屏 - ScreenFlow

#### 翻墙 - Lantern，ShadowsocksX，Surge

#### 屏幕截图 - Snip

#### 解压缩 - The Unarchiver

### 开发工具

#### 文档查看 - Dash

#### Andorid 开发 - Android Studio

#### 原型设计 - Axure RP

#### 网络抓包 - Charles

#### iOS 动画制作 - Core Animator

#### SVN版本控制管理 - Cornerstone

#### Git版本控制管理 - SourceTree

#### HTML 5 制作 - Hype 3

#### 应用程序图标制作 - IconKit

#### Objective-C 转换为Swift代码 - iSwift

#### json数据解析 - Jason，JSON Wizard

#### 数据库 - Navicat Premium

#### SQLite数据库 - sqlitebrowser

#### 查看Github Star - OhMyStar

#### Turn drawings into code - PaintCode

#### HTTP API 测试 - Paw

#### iOS UI 调试 - Reveal

#### 屏幕取色 - Sip

#### 移动应用原型设计 - Sketch

#### UML绘图 - StarUML








