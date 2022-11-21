title: iOS 完全越狱指南（iPhone 6s 15.7.1）
date: 2022-11-21 12:21:21
updated: 2022-11-21 12:21:21
tags:

- jailbreak
categories: iOS
---

手上有一台 iPhone 6S 15.7.1 的设备准备越狱做一些测试。

 GitHub和twitter上找到一个解决方案，并且在我的设备上成功越狱。https://github.com/palera1n/palera1n

### 必读

不同的设备将需要不同的步骤来越狱您的 iOS 设备。此页面将帮助您找到从哪里开始。

https://ios.cfw.guide/get-started/

**以下步骤以 iPhone 6s 15.7.1 为例：**

<!--more-->

### 准备工作

- **在运行 palera1n 之前，您必须从 App Store 安装 [提示](https://apps.apple.com/app/tips/id1069509450) 应用程序。**因为脚本将其替换为 Amy 编写的名为 Pogo 的加载器应用程序。

- 设备：iOS 15.0 ~ 15.7.1（A8 ~ A11）

  - A10 和 A11，在越狱状态必须禁用密码

- MacOS 运行环境：

  - 安装 Python 3

  - 安装依赖：

    ```shell
    $ brew install libimobiledevice
    $ brew install ideviceinstaller
    ```

- 其他准备工作可参考官方 [README](https://github.com/palera1n/palera1n/blob/main/README.md)

### 开始越狱

1. clone 代码：`git clone --recursive https://github.com/palera1n/palera1n && cd palera1n`
2. 运行：`./palera1n.sh --tweaks <iOS version you're on> --semi-tethered`
   - 在运行此命令之前将您的设备置于 DFU 模式，进入DFU模式可参考 [各型号iPhone手机进入DFU模式方法教程](https://www.i4.cn/news_detail_21378.html)
   - `semi-tethered` 标志使用 5-10GB 的存储空间，并且与 16GB 设备不兼容，如果您使用的是 16GB 设备或可用空间少于 10GB ，**请不要在命令中包含 --semi-tethered 。**
   - 如果您有 iPhone 7 或 iPhone 8，**请不要在命令中包含 --semi-tethered**，即使您满足上述使用标志的条件。
   - 如果您有仅支持 WiFi 的 iPad 或 iPod Touch，**请在命令中包含 --no-baseband**。

3. 然后您的设备将启动到 ramdisk，它将替换 Tips 应用程序和转储 blob。它还将设置引导参数和其他变量，并为 tether 做好准备或设置伪造的 rootfs。它还会为您修补内核，因此您可以使用调整。

1. 如果回到恢复/正常模式后，需要再次将设备置于 DFU 模式
2. 设备将重启，打开 Tips 应用程序，然后点击安装
3. Sileo 应该出现在您的主屏幕上
   - 如果没有，请单击“工具”并选择“全部执行”

一旦 palera1n 完成，tweaks 就可以用了。

### 效果展示

<img src="IMG_083E48B070B0-1.jpeg" alt="IMG_083E48B070B0-1" style="zoom:50%;" />

<img src="IMG_E7ED3E8BB712-1.jpeg" alt="IMG_E7ED3E8BB712-1" style="zoom:50%;" />
