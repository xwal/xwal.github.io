title: macOS 开发配置手册——工具篇
date: 2016-07-29 13:08:28
updated: 2016-11-24
tags: 
- Setup Guide
- Tools
categories: macOS
---

**更新日志**

- 2016-08-05 添加node、Python等终端命令
- 2016-09-12 更新[查找命令](#查找命令)
- 2016-11-24 更新 ruby、node、python的工具集

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

### Ruby

#### RVM

RVM 是一个命令行工具，可以提供一个便捷的多版本 Ruby 环境的管理和切换。

<https://rvm.io/>

##### RVM 安装

```
$ curl -sSL https://get.rvm.io | bash -s stable --auto-dotfiles
$ source ~/.rvm/scripts/rvm
```

修改 RVM 的 Ruby 安装源到 Ruby China 的 Ruby 镜像服务器，这样能提高安装速度。

```
$ echo "ruby_url=https://cache.ruby-china.org/pub/ruby" > ~/.rvm/user/db
```

##### Ruby 的安装与切换

列出已知的 Ruby 版本

```
$ rvm list known
```

安装一个 Ruby 版本

```
$ rvm install 2.3.0
```

切换 Ruby 版本

```
$ rvm use 2.3.0
```

如果想设置为默认版本，这样一来以后新打开的控制台默认的 Ruby 就是这个版本

```
rvm use 2.3.0 --default
``` 

查询已经安装的ruby

```
rvm list
```

卸载一个已安装版本

```
rvm remove 2.3.0
```

#### RubyGems

RubyGems 是 Ruby 的一个包管理器，提供了分发 Ruby 程序和函式庫的标准格式“gem”，旨在方便地管理gem安装的工具，以及用于分发gem的服务器。

```
$ gem install cocoapods
$ gem install fastlane
$ gem install tty
$ gem install leancloud
```

### Python

#### pyenv

Python 多版本管理器，可以用来管理和切换不同的 Python 版本。

##### 安装

```
$ brew install pyenv
```

##### 配置

如果使用的是bash

```
$ echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.bashrc
$ echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.bashrc
$ echo 'eval "$(pyenv init -)"' >> ~/.bashrc
```

如果使用的是zsh

```
$ echo 'export PYENV_ROOT="$HOME/.pyenv"' >> ~/.zshrc
$ echo 'export PATH="$PYENV_ROOT/bin:$PATH"' >> ~/.zshrc
$ echo 'eval "$(pyenv init -)"' >> ~/.zshrc
```

##### 使用

查看现在使用的 Python 版本

```
$ pyenv version
```

查看可供 pyenv 使用的 Python 版本

```
$ pyenv versions
```

安装 Python 版本

```
$ pyenv install 3.5.2
```

安装的版本会在~/.pyenv/versions目录下。

此外，可以用 `--list` 参数查看所有可安装版本

```
$ pyenv install --list
```

卸载 Python 版本

```
$ pyenv uninstall 3.5.2
```

设置全局 Python 版本，一般不建议改变全局设置

```
$ pyenv global 3.5.2
```

设置局部 Python 版本

```
$ pyenv local 3.5.2
```

设置之后可以在目录内外分别试下 `which python`或 `python --version` 看看效果, 如果没变化的话可以 `python rehash` 之后再试试

#### pip & setuptools

pip 和 setuptools 是 Python 的包管理器。

更新 pip 和 setuptools 包管理器：

```
  pip install --upgrade pip setuptools
```

安装程序包

```
  pip install <package>
```

通过依赖文件安装程序包

```
pip install -r requirements.txt
```

卸载程序包

```
$ pip uninstall <package>
```

查看所有已安装程序包

```
$ pip list
```

搜索程序包

```
$ pip search "query"
```

升级程序包

```
$ pip install --upgrade SomePackage
```


常用 Python 程序包

```
$ pip install beautifulsoup4 // HTML解析
$ pip install NetEase-MusicBox // 网易云音乐命令行版
$ pip install starred	// 利用GitHub上stars项目生成类 awesome 列表的汇总页面。
```

### Node

#### nvm

node 的版本管理工具。

##### 安装

```
$ brew install nvm
```

##### 配置

添加一下代码到 .zshrc 配置文件中：

```
export NVM_DIR="$HOME/.nvm"
. "/usr/local/opt/nvm/nvm.sh"
```

##### 使用

```
Usage:
  nvm --help                                Show this message
  nvm --version                             Print out the latest released version of nvm
  nvm install [-s] <version>                Download and install a <version>, [-s] from source. Uses .nvmrc if available
    --reinstall-packages-from=<version>     When installing, reinstall packages installed in <node|iojs|node version number>
    --lts                                   When installing, only select from LTS (long-term support) versions
    --lts=<LTS name>                        When installing, only select from versions for a specific LTS line
  nvm uninstall <version>                   Uninstall a version
  nvm uninstall --lts                       Uninstall using automatic LTS (long-term support) alias `lts/*`, if available.
  nvm uninstall --lts=<LTS name>            Uninstall using automatic alias for provided LTS line, if available.
  nvm use [--silent] <version>              Modify PATH to use <version>. Uses .nvmrc if available
    --lts                                   Uses automatic LTS (long-term support) alias `lts/*`, if available.
    --lts=<LTS name>                        Uses automatic alias for provided LTS line, if available.
  nvm exec [--silent] <version> [<command>] Run <command> on <version>. Uses .nvmrc if available
    --lts                                   Uses automatic LTS (long-term support) alias `lts/*`, if available.
    --lts=<LTS name>                        Uses automatic alias for provided LTS line, if available.
  nvm run [--silent] <version> [<args>]     Run `node` on <version> with <args> as arguments. Uses .nvmrc if available
    --lts                                   Uses automatic LTS (long-term support) alias `lts/*`, if available.
    --lts=<LTS name>                        Uses automatic alias for provided LTS line, if available.
  nvm current                               Display currently activated version
  nvm ls                                    List installed versions
  nvm ls <version>                          List versions matching a given <version>
  nvm ls-remote                             List remote versions available for install
    --lts                                   When listing, only show LTS (long-term support) versions
  nvm ls-remote <version>                   List remote versions available for install, matching a given <version>
    --lts                                   When listing, only show LTS (long-term support) versions
    --lts=<LTS name>                        When listing, only show versions for a specific LTS line
  nvm version <version>                     Resolve the given description to a single local version
  nvm version-remote <version>              Resolve the given description to a single remote version
    --lts                                   When listing, only select from LTS (long-term support) versions
    --lts=<LTS name>                        When listing, only select from versions for a specific LTS line
  nvm deactivate                            Undo effects of `nvm` on current shell
  nvm alias [<pattern>]                     Show all aliases beginning with <pattern>
  nvm alias <name> <version>                Set an alias named <name> pointing to <version>
  nvm unalias <name>                        Deletes the alias named <name>
  nvm reinstall-packages <version>          Reinstall global `npm` packages contained in <version> to current version
  nvm unload                                Unload `nvm` from shell
  nvm which [<version>]                     Display path to installed node version. Uses .nvmrc if available
  nvm cache dir                             Display path to the cache directory for nvm
  nvm cache clear                           Empty cache directory for nvm

Example:
  nvm install v0.10.32                  Install a specific version number
  nvm use 0.10                          Use the latest available 0.10.x release
  nvm run 0.10.32 app.js                Run app.js using node v0.10.32
  nvm exec 0.10.32 node app.js          Run `node app.js` with the PATH pointing to node v0.10.32
  nvm alias default 0.10.32             Set default node version on a shell

Note:
  to remove, delete, or uninstall nvm - just remove the `$NVM_DIR` folder (usually `~/.nvm`)
```

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

### 查找命令

#### find

find是最常见和最强大的查找命令，你可以用它找到任何你想找的文件。

find的使用格式如下：

```
$ find <指定目录> <指定条件> <指定动作>
- <指定目录>： 所要搜索的目录及其所有子目录。默认为当前目录。
- <指定条件>： 所要搜索的文件的特征。
- <指定动作>： 对搜索结果进行特定的处理。
```

#### locate

locate命令其实是"find -name"的另一种写法，但是要比后者快得多，原因在于它不搜索具体目录，而是搜索一个数据库（/var/lib/locatedb），这个数据库中含有本地所有文件信息。Linux系统自动创建这个数据库，并且每天自动更新一次，所以使用locate命令查不到最新变动过的文件。为了避免这种情况，可以在使用locate之前，先使用updatedb命令，手动更新数据库。

```
locate命令的使用实例：

$ locate /etc/sh
搜索etc目录下所有以sh开头的文件。

$ locate ~/m
搜索用户主目录下，所有以m开头的文件。

$ locate -i ~/m
搜索用户主目录下，所有以m开头的文件，并且忽略大小写。
```

#### whereis
whereis命令只能用于程序名的搜索，而且只搜索二进制文件（参数-b）、man说明文件（参数-m）和源代码文件（参数-s）。如果省略参数，则返回所有信息。

```
whereis命令的使用实例：
$ whereis grep
```

#### which
which命令的作用是，在PATH变量指定的路径中，搜索某个系统命令的位置，并且返回第一个搜索结果。也就是说，使用which命令，就可以看到某个系统命令是否存在，以及执行的到底是哪一个位置的命令。

```
which命令的使用实例：
$ which grep
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








