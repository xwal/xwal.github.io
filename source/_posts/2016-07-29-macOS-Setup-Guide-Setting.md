title: macOS 开发配置手册——设置篇
date: 2016-07-29 13:14:54
tags:
- Setup Guide
- Tools
categories: macOS
---

> 工欲善其事，必先利其器。—— 设置篇

<!-- more -->

## 系统设置

### 将功能键(F1-F12)设置为标准的功能键

MacBook键盘最上面一排的功能键(F1-F12)默认是系统亮度和声音之类的快捷设置，当MacBook作为你的娱乐电脑时，这样的默认设置是非常方便的，但是对于将MacBook作为工作电脑而且需要频繁使用功能键(F1-F12)的人，最好将功能键(F1-F12)的行为设置为标准的功能键。

打开【系统设置】，点击【键盘】，设置如下：
![Snip20160729_1](http://7xooko.com1.z0.glb.clouddn.com/2016-08-03-Snip20160729_1.png)


### 设置触摸板

打开【系统设置】，点击【触摸板】，根据需要设置，众享丝滑。
![Snip20160729_2](http://7xooko.com1.z0.glb.clouddn.com/2016-08-03-Snip20160729_2.png)
![Snip20160729_3](http://7xooko.com1.z0.glb.clouddn.com/2016-08-03-Snip20160729_3.png)
![Snip20160729_4](http://7xooko.com1.z0.glb.clouddn.com/2016-08-03-Snip20160729_4.png)
### 将Dock停靠在屏幕左边

MacBook的屏幕是一个长方形，如果你将Dock放在下面，那么屏幕的可用宽度就会减少，另外人眼阅读时的顺序是从左往右，因此Dock放在左边更适合将MacBook作为工作电脑的人。

打开【系统设置】，点击【Dock】,

- 将图标的Size调到合适大小
- 关闭放大特效（即鼠标放到Dock上图标放大的效果，此效果干扰注意力）
- 在【置于屏幕上的位置】一栏，选择【左边】
- 勾选【将窗口最小化为应用程序图标】

![Snip20160729_5](http://7xooko.com1.z0.glb.clouddn.com/2016-08-03-Snip20160729_5.png)
### 快速锁定屏幕

打开【系统设置】，点击【桌面与屏幕保护程序】图标，选择【屏幕保护程序】标签页，点击右下角的【触发角..】，在弹出的界面中右下角选择【将显示器置入睡眠状态】，点击【好】确定。
![Snip20160803_1](http://7xooko.com1.z0.glb.clouddn.com/2016-08-03-Snip20160803_1.png)
![Snip20160803_3](http://7xooko.com1.z0.glb.clouddn.com/2016-08-03-Snip20160803_3.png)

### 系统常用快捷键

学习系统快捷键，适当使用快捷键将会提升你的工作效率。
![1280800](http://7xooko.com1.z0.glb.clouddn.com/2016-08-03-1280800.png)

壁纸下载地址：<http://bbs.feng.com/read-htm-tid-4254274.html>
Mac 键盘快捷键 官方总览：<https://support.apple.com/zh-cn/HT201236>

### 关闭自动纠正拼写

有些时候在文本输入框中输入文本时，会出现如下情况。一按空格键或者回车键会填写弹出框的文本，很烦人。

![](http://7vzrbk.com1.z0.glb.clouddn.com/ghost/content/images/2015/10/QQ20151025-0-2x.png)

可以通过【关闭自动纠正拼写】解决

![](http://7vzrbk.com1.z0.glb.clouddn.com/ghost/content/images/2015/10/QQ20151024-0-2x.png)

### tree命令中文文件名显示异常

![](http://7xooko.com1.z0.glb.clouddn.com/QQ20160123-0@2x.png)

解决办法：追加`tree -N`参数

### Mac 中滚动截屏

安装腾讯的snip

[官方下载地址](http://www.snip.qq.com)

[详细设置教程](http://jingyan.baidu.com/article/fec4bce2458d03f2618d8b8e.html)

### How to Solve Missing Fonts in Sketch App

All you have to do is enter the following command in Terminal.

`$ curl https://raw.githubusercontent.com/qrpike/Web-Font-Load/master/install.sh | sh`


