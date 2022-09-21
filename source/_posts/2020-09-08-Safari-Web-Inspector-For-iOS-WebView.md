title: 在 Mac 上使用 Safari 调试 iOS WebView
date: 2020-09-08 15:36:14
tags:

- WebView
- Inspector
- Tips
categories: iOS
---

## 准备工作

### Mac OS

#### Safari 开启调试模式

依次选择 **偏好设置 > 高级 > 在菜单栏中显示“开发”菜单**。

<img src="1599551644-image-20200908154443157.png" alt="image-20200908154443157" style="zoom: 33%;" />

### iOS

#### Safari 开启调试模式

要远程调试 iOS Safari ，必须启用 Web 检查 功能，打开 iPhone 依次进入 **设置 > Safari > 高级 > Web 检查 > 启用**。

<img src="1599551655-IMG_19800580398B-1.jpeg" alt="IMG_19800580398B-1" style="zoom: 33%;" />

## 开发调试

### 启动 Web Inspector

1. iPhone 使用 Safari 浏览器打开要调试的页面，或者 App 里打开要调试的页面
2. Mac 打开 Safari 浏览器调试（菜单栏 > 开发 > iPhone 设备名 -> 选择调试页面）
3. 在弹出的 Safari Developer Tools 中调试

### 调试菜单

![img](1599553103-640.jpeg)

#### Resources

这个菜单用来显示当前网页中加载的资源，比如 HTML、JS、CSS、图片、字体等资源文件，并且可以对 JS 代码添加断点来调试代码。

##### 断点

Inspector 中的断点调试和 Xocde 的大同小异。

##### 格式化代码

web 页面中的 JS、CSS、HTML 文件大多数都经过了压缩处理，以前 inspector 并不支持 HTML，这次可以格式化 HTML 文件了：
![img](1599553124-640-20200908161844693.jpeg)

##### Local overrides

如果你想调试某个文件的时候，通常把改动好的代码推动服务端，然后通过浏览器访问，查看效果，整个过程可能会耗费很长时间。Local overrides 提供了一种能力，可以替换当前页面所加载的文件，这样只需要修改本地文件即可，当页面加载的时候会直接使用本地的文件，达到快速调试的作用。更多内容。
![img](1599553134-640.png)

##### Bootstrap Script

Bootstrap Script 也叫引导程序，通常是程序执行时第一个要执行的文件，在 Inspector 中可以创建一个这样的文件用来作为调试工具使用，比如替换某个函数的实现，给某个函数增加特殊的调试语句。在调试的时候，很多 JS 函数都经过了压缩处理，可通过这种方式把压缩的函数替换成未被压缩的函数，方便调试。
更多内容

#### Timelines

Timelines 用来分享各种功能的加载时长。

#### Sotrage

storage 用来显示缓存的数据，比如 Local Storage、Session Storage、Indexed DataBase。

#### Layers

Layers 主要用来显示页面的绘制、布局。
![img](1599553147-640-20200908161907264.jpeg)

#### Console

console 就是打印日志的地方，也可以执行 JavaScript 代码。Console 的界面如下：

![img](1599553155-640-20200908161914993.jpeg)