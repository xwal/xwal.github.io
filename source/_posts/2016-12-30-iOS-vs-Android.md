title: iOS vs Android
date: 2016-12-30 19:05:56
tags:
categories: 软件设计
---

## 系统架构

### iOS
iOS系统分为可分为四级结构，由上至下分别为可触摸层（Cocoa Touch Layer）、媒体层（Media Layer）、核心服务层（Core Services Layer）、核心系统层（Core OS Layer），每个层级提供不同的服务。低层级结构提供基础服务如文件系统、内存管理、I/O操作等。高层级结构建立在低层级结构之上提供具体服务如UI控件、文件访问等。
![797918-71efb73f5f3ab3](http://file.blog.chaosky.tech/2016-12-30-797918-71efb73f5f3ab3c6.png)

#### 可触摸层（Cocoa Touch Layer）
可触摸层主要提供用户交互相关的服务如界面控件、事件管理、通知中心、地图，包含以下框架：
* UIKit（界面相关）
* EventKit（日历事件提醒等）
* Notification Center（通知中心）
* MapKit（地图显示）
* Address Book（联系人）
* iAd（广告）
* Message UI（邮件与SMS显示）
* PushKit（iOS8新push机制）
![797918-486bd1393e7d908a](http://file.blog.chaosky.tech/2016-12-30-797918-486bd1393e7d908a.jpg)


#### 媒体层（Media Layer）

媒体层主要提供图像引擎、音频引擎、视频引擎框架。
* 图像引擎（Core Graphics、Core Image、Core Animation、OpenGL ES）
* 音频引擎 （Core Audio、 AV Foundation、OpenAL）
* 视频引擎（AV Foundation、Core Media）
![797918-30e2f3470787b368](http://file.blog.chaosky.tech/2016-12-30-797918-30e2f3470787b368.jpg)

#### 核心服务层（Core Services Layer）
核心服务层为程序提供基础的系统服务例如网络访问、浏览器引擎、定位、文件访问、数据库访问等，主要包含以下框架：
* CFNetwork（网络访问）
* Core Data（数据存储）
* Core Location（定位功能）
* Core Motion（重力加速度，陀螺仪）
* Foundation（基础功能如NSString）
* Webkit（浏览器引擎）
* JavaScript（JavaScript引擎）
![797918-cc0de0f6f45ff252](http://file.blog.chaosky.tech/2016-12-30-797918-cc0de0f6f45ff252.jpg)

#### 核心系统层（Core OS Layer）
核心系统层提供为上层结构提供最基础的服务如操作系统内核服务、本地认证、安全、加速等。

* 操作系统内核服务（BSD sockets、I/O访问、内存申请、文件系统、数学计算等）
* 本地认证（指纹识别验证等）
* 安全（提供管理证书、公钥、密钥等的接口）
* 加速 (执行数学、大数字以及DSP运算,这些接口iOS设备硬件相匹配）
![797918-2965748e8e244c2e](http://file.blog.chaosky.tech/2016-12-30-797918-2965748e8e244c2e.jpg)

### Android

Andorid 大致可以分为四层结构：应用层、应用框架层、系统运行库层、Linux内核层。
![20140311140541765](http://file.blog.chaosky.tech/2016-12-30-20140311140541765.jpeg)


#### 应用层
所有安装在手机上的应用程序都是属于这一层的，比如系统自带的联系人、短信等程序，或者是你从 Google Play 上下载的小游戏，当然还包括你自己开发的程序。

#### 应用框架层
这一层主要提供了构建应用程序时可能用到的各种 API，Android 自带的一些核心应用就是使用这些 API 完成的，开发者也可以通过使用这些 API 来构建自己的应用程序。

#### 系统运行库层
这一层通过一些 C/C++ 库来为 Android 系统提供了主要的特性支持。如 SQLite 库提供了数据库的支持，OpenGL|ES 库提供了 3D 绘图的支持，WebKit 库提供了浏览器内核的支持等。

#### Linux 内核层
Android 系统是基于 Linux 内核的，这一层为 Android 设备的各种硬件提供了底层的驱动，如显示驱动、音频驱动、照相机驱动、蓝牙驱动、Wi-Fi 驱动、电源管理等。



