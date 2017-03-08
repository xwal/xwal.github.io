title: OS X Cocos2d-x 环境搭建
date: 2017-02-23 22:32:32
updated: 2017-02-23 22:32:32
tags:
- Cocos2d-x
categories: 游戏开发
---

**更新日志**

## Cocos2d-x 引擎

Cocos2d-x引擎可在 Cocos官网下载，其下载地址为：<http://www.cocos.com/download/>。当然，亦可从Cocos2d-x的 GitHub 仓库拉取，仓库地址：<https://github.com/cocos2d/cocos2d-x>。下载完成后，引擎包的主要内容下。
![framework_architecture](http://7xooko.com1.z0.glb.clouddn.com/2017-03-06-framework_architecture.jpg)


* AUTHORS：作者目录，包含所有给Cocos2d-x引擎贡献代码的开发者
* build：包含测试例子、cocos2d_lib的Xcode以及Visual Studio工程
* CHANGELOG：所有历史版本详细改动列表
* CMakeLists.txt：cmake配置文件
* cocos：Cocos2d-x引擎源代码
* CONTRIBUTING.md：贡献代码指南
* docs：包含JavaScript代码风格规范、当前发布说明和当前版本升级指南
* download-deps.py：下载第三方库的脚本
* extensions：第三方扩展
* external：存放第三方库的文件夹
* licenses：所有许可协议
* plugin：插件
* README.cmake：针对cmake用法的说明文件
* README.md：Cocos2d-x引擎简介
* setup.py：Cocos Console的安装脚本
* templates：Cocos Console创建项目时使用的模板
* tests：各分支的测试项目
* tools：工具文件夹
* —bindings-generator：脚本绑定工具
* —cocos2d-console：Cocos Console工具
* —tojs：JSB自动绑定配置文件以及生成脚本
* —tolua：Lua绑定配置文件以及生成脚本
* web：Cocos2d-JS游戏引擎

<!-- more -->

## Cocos Console

Cocos Console 是 Cocos2d-x 引擎下的一个命令行工具，它用来管理 Cocos 工程，其中包含创建、运行、编译、调试以及打包项目等。

Cocos Console 位于引擎包 cocos2d-x/tools/cocos2d-console 目录下，通过运行引擎包目录下的 setup.py 脚本即可安装。在安装的过程中，Cocos Console 需要开发者提供 Android NDK、Android SDK 和 Apache ANT 的文件路径。另外，Cocos Console 是一个采用 Python 语言编写的跨平台脚本工具，所以在安装Cocos Console 之前，需要先安装好Python。

### 安装 Python

在 Mac OS X 中，操作系统本身自带了 Python，而在 Windows 操作系统中，Python 则需要我们自行下载并安装，其下载地址为：<https://www.python.org/downloads/index.html>。若你的Mac OS X系统中没有Python，也可通过此地址下载安装。下载至Mac OS X和Windows上的安装包分别是一个.pkg或者.msi文件。

打开终端，输入 `python --version`。若提示 Python 版本号，则说明 Python 安装成功。

### Android 环境配置

当安装好 Python 之后，你便可以开始准备 Android 相关的软件包了。当然，若你不需要支持 Android，除了 Apache Ant 之外，其余步骤可以跳过，不必配置。

* **Apache Ant**：将软件编译、测试、部署等步骤联系在一起加以自动化的一个工具，大多用于Java环境中的软件开发。下载地址：<http://ant.apache.org/bindownload.cgi>。
* **Android SDK**：即Software Development Kit的简称，中文译为软件开发工具包。在Android 中，它为开发者提供了库文件以及其他开发所用到的工具。下载地址：<http://developer.android.com/ tools/sdk/ndk/index.html>。
* **Android NDK**：即Native Development Kit的简称，它是一系列工具的集合，可以帮助开发 者快速开发C/C++的动态库。另外，它还能自动将.so文件和Java应用一起打包成.apk。下 载地址：<https://developer.android.com/sdk/index.html?hl=sk>。
* **JDK**：Java的开发工具包，包括Java运行环境、Java工具和Java基础类库。下载地址：<https://www.oracle.com/downloads/index.html>。

### 安装 Cocos Console

打开终端，进入 Cocos2d-x 引擎目录下，然后再运行setup.py脚本，相关命令如下：

```
$ cd /Users/Chaosky/Cocos/cocos2d-x-3.14.1
$ python setup.py
```

然后根据提示，将Cocos Console所需的文件路径拖曳进去，最后根据末尾行提示进行对应的操作。
![Jietu20170306-170411]http://7xooko.com1.z0.glb.clouddn.com/2017-03-06-Jietu20170306-170411.png)

此时，Cocos Console安装成功。若要卸载Cocos Console，则Mac OS X用户可删除 `/Users/用户名/下.bash_profile或者.zshrc` 文件中对应的值，而Windows用户只需删除对应的系统环境变量值即可。

## 创建、编译和运行工程

在终端中执行 `cocos --help`，查看 cocos 命令行工具集的功能。

```
$ cocos --help

可用的命令：
	run              在设备或者模拟器上编译，部署和运行工程。
	gen-libs         生成引擎的预编译库。生成的库文件会保存在引擎根目录的 'prebuilt' 文件夹。
	luacompile       对 lua 文件进行加密和编译为字节码的处理。
	deploy           编译并在设备或模拟器上部署工程。
	package          管理 cocos 中的 package。
	compile          编译并打包工程。
	gen-simulator    生成 Cocos 模拟器。
	new              创建一个新的工程。
	jscompile        对 js 文件进行加密和压缩处理。
	gen-templates    生成用于 Cocos Framework 环境的模板。

可用的参数：
	-h, --help			显示帮助信息。
	-v, --version			显示命令行工具的版本号。
	--ol ['en', 'zh', 'zh_tr']	指定输出信息的语言。

示例：
	cocos new --help
	cocos run --help
```

### 创建

终端中输入`cocos new --help`查看功能。

```
$ cocos new --help

usage: cocos new [-h] [-p PACKAGE_NAME] [-d DIRECTORY] [-t TEMPLATE_NAME]
                 [--ios-bundleid IOS_BUNDLEID] [--mac-bundleid MAC_BUNDLEID]
                 [-e ENGINE_PATH] [--portrait] [--no-native] -l {cpp,lua,js}
                 [PROJECT_NAME]

创建一个新的工程。

positional arguments:
  PROJECT_NAME          设置工程名称。

optional arguments:
  -h, --help            show this help message and exit
  -p PACKAGE_NAME, --package PACKAGE_NAME
                        设置工程的包名。
  -d DIRECTORY, --directory DIRECTORY
                        设置工程存放路径。
  -t TEMPLATE_NAME, --template TEMPLATE_NAME
                        设置使用的模板名称。
  --ios-bundleid IOS_BUNDLEID
                        设置工程的 iOS Bundle ID。
  --mac-bundleid MAC_BUNDLEID
                        设置工程的 Mac Bundle ID。
  -e ENGINE_PATH, --engine-path ENGINE_PATH
                        设置引擎路径。
  --portrait            设置工程为竖屏。
  -l {cpp,lua,js}, --language {cpp,lua,js}
                        设置工程使用的编程语言，可选值：[cpp |
                        lua | js]

lua/js 工程可用参数:
  --no-native           设置新建的工程不包含 C++
                        代码与各平台工程。
```

具体有几种方式：

1. 创建一个名为projectName，并同时包含Cocos2d-HTML5和Cocos2d-x JSB项目

	```
	cocos new projectName -l js
	```
	
2. 创建一个名为projectName，且仅含Cocos2d-HTML5的项目， --no-native表示不需要支持Native平 台（iOS、Android、Mac、Windows等），仅支持浏览器即可
	
	```
	cocos new projectName -l js --no-native
	```
	
3. 在桌面上创建一个名为projectName的项目
	
	```
	cocos new projectName -l js -d ./Desktop
	```
	
4. 在桌面上创建一个名为projectName的项目，并设置为竖屏
	
	```
	cocos new projectName -l js -d ./Desktop --portrait
 	```
 	
 其中 `-l` 表示采用的语言，可选值为 cpp、lua以及js。
 
### 编译、部署、运行
 
当项目创建完毕后，可以通过下列命令将项目运行在浏览器中：

```
cd ./Desktop/HelloWorld cocos run -p web
```

除创建命令外，Cocos Console还为工程提供了运行、编译等命令，具体如下：

```
// 运行在指定的平台上
cocos run -p web|ios|android|mac|win32
// 将项目工程打包到指定的平台上
cocos compile -p web|ios|android|mac|win32 -m release
```

Cocos Console提供了相关的help指令，方便开发者查询Cocos Console相关的指令。下面举几个 help指令的例子，其中help可用字母h替代：

```
cocos new --help
cocos run --help
cocos compile --help
```
 
 

