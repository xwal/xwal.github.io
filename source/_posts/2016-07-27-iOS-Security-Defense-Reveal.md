title: 使用Reveal分析别人App的UI布局
date: 2016-07-27 13:43:53
updated: 2016-07-27 13:43:53
tags:
- Tools
- Reveal
- Jailbreak
categories: iOS
---

## 准备工作

### 越狱iOS设备
1. 如何越狱可以参考[盘古越狱](http://www.pangu.io)的相关文章，具体详情参见链接：<http://jailbreak.25pp.com/ppjailbreak/?from=25pp_00119>，最新iOS越狱可以支持iOS 9.3.3，也可以看我整理的[非官方的越狱文章](http://chaosky.me/2016/12/07/Jailbreak-Using-Pangu-and-Cydia-Impactor/)。
2. 在Cydia源中安装OpenSSH、MobileSubstrate等工具，之后的文章会讲到其他工具

### macOS 本地安装Reveal
具体安装及使用可以参见我之前的文章：<http://chaosky.me/2016/07/27/Reveal>

<!-- more -->

## 操作步骤
### 在Cydia中搜索并安装Reveal Loader
![Snip20160727_11](2016-07-27-Snip20160727_11.png)

### 远程连接iPhone设备
1. 在Cydia中安装OpenSSH工具
2. 打开Wi-Fi设置，获取IP地址（例如：192.168.2.6）
![Snip20160727_1](2016-07-27-Snip20160727_1.png)

1. 打开终端，执行命令`ssh root@[设备IP地址]`（例如：`ssh root@192.168.2.6`）
2. 等待几分钟后，允许新连接
![Snip20160727_3](2016-07-27-Snip20160727_3.png)

1. 输入密码`alpine`登录iPhone设备
![Snip20160727_4](2016-07-27-Snip20160727_4.png)


### 检查iOS设备上`/Library/`目录下是否有一个名为`RHRevealLoader`的目录
![Snip20160727_5](2016-07-27-Snip20160727_5.png)

1. 若没有则创建该目录：`mkdir /Library/RHRevealLoader`
2. 启动Reveal并选择Help → Show Reveal Library in Finder，这将会打开Finder窗口，并显示一个名为iOS-Libraries的文件夹。
	![](reveal/show-reveal-library-in-finder.jpg)
	将该目录下的`libReveal.dylib`通过scp或者iFunBox上传到刚才的手机目录，scp执行的命令如下：
	
	```
	scp /Applications/Reveal.app/Contents/SharedSupport/iOS-Libraries/libReveal.dylib root@192.168.2.6:/Library/RHRevealLoader
	```
### 重启设备
1. 可以在设备上执行命令：`killall SpringBoard`
2. 也可以重启设备，不过需要注意的是，最新的越狱为不完美越狱，重启设备需要点击**PP盘古越狱**重新越狱

### 启动Reveal调试别人的App
1. 打开设置程序，配置Reveal Loader
	![Snip20160727_6](2016-07-27-Snip20160727_6.png)
2. 在Reveal设置中选择你要查看的App，Enabled Applications
	![Snip20160727_8](2016-07-27-Snip20160727_8.png)
3. 在Reveal中调试查看
	调试时，需要注意越狱设备和Mac需要在同一网路环境中
	![Snip20160727_10](2016-07-27-Snip20160727_10.png)
	
## 注意

最新版 Reveal v4 下载地址：<http://xclient.info/s/reveal.html> 

新版本的 Reveal v4 的 `libReveal.dylib` 改名为 `RevealServer.framework` 了，逆向分析的时候手机端只要把 `RevealServer.framework` 目录下的 `RevealServer ` 改名为 `libReveal.dylib` 拷贝到手机上的 `/Library/RHRevealLoader` 目录中即可。
	
## 参考文章
* <http://wiki.jikexueyuan.com/project/ios-security-defense/reveal.html>
* [iOS应用逆向工程](https://www.amazon.cn/iOS应用逆向工程-沙梓社/dp/B00VFDVY7E/ref=sr_1_1?ie=UTF8&qid=1469610259&sr=8-1&keywords=iOS+逆向)
* <https://xiuchundao.me/post/integrating-reveal-inspect-app-on-jailbreak-device-with-reveal>	

	





