title: iOS 依赖库管理工具
date: 2016-11-13 20:31:44
updated: 2016-11-13 20:31:44
tags:
- CocoaPods
- Carthage
categories: iOS
---

## CocoaPods

### CocoaPods 简介

CocoaPods是一个用来帮助我们管理第三方依赖库的工具。它可以解决库与库之间的依赖关系，下载库的源代码，同时通过创建一个Xcode的workspace来将这些第三方库和我们的工程连接起来，供我们开发使用。

使用CocoaPods的目的是让我们能自动化的、集中的、直观的管理第三方开源库。

<!-- more -->

### 检查Mac是否安装Ruby和gem

在终端中输入命令：`ruby --version` 和`gem --version`

```
$ ruby --version
ruby 2.0.0p643 (2015-02-25 revision 49749) [x86_64-darwin14.3.0]
$ gem --version
2.4.8
```

Ruby 是一门开发语言，gem 为 Ruby 第三方库管理工具，CocoaPods 是用 Ruby 写的一个第三方工具。

**Ruby的版本需要大于 2.2.2版本。如果小于该版本，通过以下方式安装更高版本的 Ruby。**

### 安装 Ruby 环境

1. 安装 Xcode 及 Command Line Tools。安装 Command Line Tools 命令：`xcode-select --install`
2. 安装 RVM，Ruby 的多版本管理工具。并通过 RVM 安装更高版本的 Ruby。
  
  ```
  $ curl -L https://get.rvm.io | bash -s stable
  $ source ~/.rvm/scripts/rvm
  $ rvm install 2.3.0
  $ rvm use 2.3.0
  $ /bin/bash --login
  ```
3. 修改 gem 镜像
  
  ```
  $ gem sources --add https://gems.ruby-china.org/ --remove https://rubygems.org/
  $ gem sources -l
  https://gems.ruby-china.org
  # 确保只有 gems.ruby-china.org
  ```

### 安装 CocoaPods

安装

```
$ gem install cocoapods
```

初始化 CocoaPods 环境

```
$ pod setup
```

初始化环境需要更新下载 CocoaPods 仓库，该步骤花费很长时间。更简便的方式是：从其他已初始化好的电脑上，拷贝目录 `~/.cocoapods/repos/` 到本机的相同目录中。

### 使用 CocoaPods

1. 创建 Xcode 工程并切换到该工程路径

2. 使用命令 `pod init` 在当前文件夹下生成一个 **Podfile** 文件

3. 编辑 Podfile，输入如下类似信息：

	```
	$ vim Podfile
	platform :ios, '8.0'
	# 屏蔽 CocoaPods 库里面的所有警告
	inhibit_all_warnings!
		
	target 'CocoaPodsDemo' do
	  # 可以用framework的pod替代静态库
	  # use_frameworks!
		
	  # Pods for CocoaPodsDemo
	  pod "AFNetworking", "~> 2.5.4"
	  pod 'SDWebImage'
	  pod 'KVNProgress'
		
	  target 'CocoaPodsDemoTests' do
	    inherit! :search_paths
	    # Pods for testing
	  end
		
	  target 'CocoaPodsDemoUITests' do
	    inherit! :search_paths
	    # Pods for testing
	  end
		
	end   
	```
   Pod 语法格式为：`pod '第三库名称', '版本号'`，一个依赖项通过pod名和可选的版本号来声明。
   
   ```
   pod 'AFNetworking', '~> 2.5.4'
   ```
   最新版本的依赖，可以忽略版本号，这样写：
   
   ```
   pod 'AFNetworking'
   ```
   指定Pod固定版本，可以写上具体的版本号来指定：
   
   ```
   pod 'AFNetworking', '2.5.4'
   ```
   版本号标识区别：
   
   > **>1.0**		高于1.0的任何版本
   > **\>= 1.0**	至少版本为1.0
   > **<1.0**		低于1.0的任何版本
   > **<=1.0**		版本1.0和任何低于1.0的版本
   > **~> 1.0** 	兼容1.0版本的最新版
   > **== 1.0或1.0**	都表示指定版本
   
   **inhibit_all_warnings!**：屏蔽 CocoaPods 库里面的所有警告
   **use_frameworks!**：可以用framework的pod替代静态库

4. 安装工程依赖的第三方库

   ```
   $ pod install
   Updating local specs repositories
   Analyzing dependencies
   Downloading dependencies
   Installing AFNetworking (2.5.4)
   Installing KVNProgress (2.2.2)
   Installing SDWebImage (3.7.3)
   Generating Pods project
   Integrating client project
   [!] Please close any current Xcode sessions and use `CocoaPodsDemo.xcworkspace` for this project from now on.
   Sending stats
   Pod installation complete! There are 3 dependencies from the Podfile and 3 total
   pods installed.
   ```

   若出现`pods installed`字样表示安装成功。

5. 关闭Xcode工程，打开.xcworkspace文件。

6. 在工程中导入第三库文件，只需要`#import <AFNetworking.h>`类似的即可，开启CocoaPods之旅。

更多用法参考本文提供的参考链接。

### 参考链接

1. <http://code4app.com/article/cocoapods-install-usage>
2. <http://blog.csdn.net/wzzvictory/article/details/18737437>
3. <http://blog.csdn.net/wzzvictory/article/details/19178709>

## Carthage

### Carthage 简介

Carthage的目标是用最简单的方式来管理Cocoa第三方框架。

Carthage编译你的依赖，并提供框架的二进制文件，但你仍然保留对项目的结构和设置的完整控制。Carthage不会自动的修改你的项目文件或编译设置。

**Carthage只正式支持动态框架，动态框架能够在任何版本的OS X上使用，但只能在iOS 8及以上版本使用。**

### 安装 Homebrew

OS X 不可或缺的套件管理器，用于安装命令工具。

终端中执行如下命令：

```
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

### 安装 Carthage

终端执行命令安装Carthage

```
brew update
brew install carthage
```

### 使用Carthage

1. 创建Xcode工程并切换到该工程路径
2. 创建一个`Cartfile`，将你想要使用的框架列在里面

   ```
   github "AFNetworking/AFNetworking" ~> 3.0
   github "rs/SDWebImage"
   ```
3. 运行`carthage update`，将获取依赖文件到一个`Carthage.checkout`文件夹，然后编译每个依赖
4. 在你的应用程序target的`General`设置标签中的`Embedded Binaries`区域，将框架从`Carthage.build`文件夹拖拽进去。

### 参考链接

1. <http://www.cocoachina.com/ios/20141204/10528.html>
2. [官方文档](https://github.com/Carthage/Carthage)

## Carthage与CocoaPods的不同

1. Carthage只支持iOS 8及以上版本使用。

2. 首先，CocoaPods默认会自动创建并更新你的应用程序和所有依赖的Xcode workspace。Carthage使用xcodebuild来编译框架的二进制文件，但如何集成它们将交由用户自己判断。CocoaPods的方法更易于使用，但Carthage更灵活并且是非侵入性的。

3. CocoaPods的目标在它的README文件描述如下：

   > …为提高第三方开源库的可见性和参与度，创建一个更中心化的生态系统。

   与之对照，Carthage创建的是去中心化的依赖管理器。它没有总项目的列表，这能够减少维护工作并且避免任何中心化带来的问题（如中央服务器宕机）。不过，这样也有一些缺点，就是项目的发现将更困难，用户将依赖于Github的趋势页面或者类似的代码库来寻找项目。

4. CocoaPods项目同时还必须包含一个podspec文件，里面是项目的一些元数据，以及确定项目的编译方式。Carthage使用xcodebuild来编译依赖，而不是将他们集成进一个workspace，因此无需类似的设定文件。不过依赖需要包含自己的Xcode工程文件来描述如何编译。

5. 最后，我们创建Carthage的原因是想要一种尽可能简单的工具——一个只关心本职工作的依赖管理器，而不是取代部分Xcode的功能，或者需要让框架作者做一些额外的工作。CocoaPods提供的一些特性很棒，但由于附加的复杂性，它们将不会被包含在Carthage当中。

## Swift Package Manager

Swift包管理器是一个用于管理Swift代码分发的工具。它与Swift构建系统集成，自动化处理下载、编译和链接依赖关系。

软件包管理器包含在Swift 3.0及更高版本中。

### 安装配置

#### macOS

下载安装 [Xcode 8.1](https://developer.apple.com/download/)。

#### Ubuntu Linux

1. 安装以下Linux 系统包：

	```
	$ sudo apt-get update
	$ sudo apt-get install clang libicu-dev libcurl4-openssl-dev libssl-dev
	```
2. 从 [swift.org](https://swift.org/download/) 下载 Swift 工具链。
3. 解压缩 **.tar.gz** 文件，更新 **PATH** 环境变量，包含以下工具：

	```
	$ export PATH=<path to uncompressed tar contents>/usr/bin:$PATH
	```
	
### 开始使用
	
1. 创建工程路径

	```
	$ mkdir myFirstProject
	```
2. 使用 Swift 包管理器创建 Swift 工程
	
	```
	$ cd myFirstProject
	$ swift package init --type executable
	```
3. 在 **myFirstProject** 目录下的目录结构如下
	
	```
	myFirstProject
	├── Package.swift
	├── Sources
	│   └── main.swift
	└── Tests
	```
4. 在 **Package.swift** 中添加依赖项

	```
	import PackageDescription

	let package = Package(
	    name: "myFirstProject",
	    dependencies: [
	        .Package(url: "https://github.com/IBM-Swift/Kitura.git", majorVersion: 1, minor: 1)
	    ])
	```
5. 编译程序
	
	```
	$ swift build
	```
6. 在代码中就可以通过 `import Kitura` 导入模块。
	在 **Sources/main.swift** 添加如下代码：
	
   ```
   import Kitura

	// Create a new router
	let router = Router()
	
	// Handle HTTP GET requests to /
	router.get("/") {
	    request, response, next in
	    response.send("Hello, World!")
	    next()
	}
	
	// Add an HTTP server and connect it to the router
	Kitura.addHTTPServer(onPort: 8090, with: router)
	
	// Start the Kitura runloop (this call never returns)
	Kitura.run()
   ```
7. 运行
	
	```
	$ .build/debug/myFirstProject
	```
8. 在 macOS 上可以生成 Xcode 工程
	
	```
	$ swift package generate-xcodeproj
	```

