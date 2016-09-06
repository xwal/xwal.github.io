title: Mac 安装 CocoaPods
date: 2015-12-23 11:28:51
tags:
- Tools
- CocoaPods
categories: iOS
---
## 安装Ruby环境

### 查看Mac是否安装Ruby和gem

在终端中输入命令：`ruby --version` 和`gem --version`

输出如下类似提示符，则表示Ruby环境已安装

```
$ ruby --version
ruby 2.0.0p643 (2015-02-25 revision 49749) [x86_64-darwin14.3.0]
$ gem --version
2.4.8
```

PS：Ruby是一门开发语言，gem为Ruby第三方库管理工具，CocoaPods是用Ruby写的一个第三方工具。

### 若提示`command not found` 则需要安装Ruby环境

- 安装Ruby环境需要安装Xcode及Command Line Tools。

- 安装Command Line Tools：`xcode-select --install`

- 安装RVM，Ruby的多版本管理工具。

  ```
  $ curl -L https://get.rvm.io | bash -s stable
  $ source ~/.rvm/scripts/rvm
  $ rvm install 2.0.0
  $ rvm use 2.0.0
  $ /bin/bash --login
  ```



## 安装CocoaPods

使用淘宝的镜像安装Ruby的第三方库，修改gem的镜像：

```
$ gem sources --remove https://rubygems.org/
$ gem sources -a https://ruby.taobao.org/
```

为了验证你的Ruby镜像是**并且仅是**淘宝，可以用以下命令查看：

```
$ gem sources -l
# 只有在终端中出现下面文字才表明你上面的命令是成功的：
* CURRENT SOURCES *
https://ruby.taobao.org/
```

如果出现多个需要将其余的源删除。

终端中执行安装CocoaPods

```
$ sudo gem install cocoapods
```

执行完成后，需要初始化CocoaPods的环境

```
$ pod setup
```



## 使用CocoaPods

1. 创建Xcode工程并切换到该工程路径

2. 使用命令`pod init`在当前文件夹下生成一个**Podfile**文件

3. 编辑该文件，在该文件中输入如下信息：

   ```
   $ vim Podfile
   platform :ios, '7.0'
   pod "AFNetworking", "~> 2.5.4"
   pod 'SDWebImage'
   pod 'KVNProgress'
   ```

   该文件中的命令格式为：`pod '第三库名称', '版本号'`

   第三库名称，名称一定要正确，不然有可能安装失败。

   版本号标识区别

   > \>= 1.0 至少版本为1.0
   >
   > ~> 1.0 兼容1.0版本的最新版
   >
   > == 1.0或1.0 都表示指定版本

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

## 参考链接

1. <http://code4app.com/article/cocoapods-install-usage>
2. <http://blog.csdn.net/wzzvictory/article/details/18737437>
3. <http://blog.csdn.net/wzzvictory/article/details/19178709>


