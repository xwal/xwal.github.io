title: Xcode 使用
date: 2015-09-23 20:52:17
tags: 
- Tools
categories: iOS
---
## Xcode只显示iOS Simulator的identifier，没有显示device version

当安装多个版本的Xcode时，有可能会在某个Xcode中出现相同机型相同版本的多个模拟器，如图所示：![alt](http://7vzrbk.com1.z0.glb.clouddn.com/ghost/content/images/2015/07/N--O83POLH925H7-7_-3TJT.jpg)  

### 解决办法：  

#### 方法一：  
挨个删除所有重复的设备  

#### 方法二：  
1. 退出Xcode.app, iOS Simulator.app等
2. 执行命令关闭模拟器服务：`sudo killall -9 com.apple.CoreSimulator.CoreSimulatorService`
3. 执行命令删除所有已经存在的模拟器：`rm -rf ~/Library/Developer/CoreSimulator/Devices`
4. 重启Xcode，就可以看到在`~/Library/Developer/CoreSimulator/Devices`目录，新生成的模拟器设备。
5. 这样就不会有重复的模拟器设备了。  

<!--more-->

## 如何删除Xcode Downloads中的Components
![alt](http://7vzrbk.com1.z0.glb.clouddn.com/ghost/content/images/2015/09/QQ20150923-1-2x.png)

### 解决办法：
1. 退出Xcode.app, iOS Simulator.app等  
2. `cd /Library/Developer/CoreSimulator/Profiles/Runtimes`，如果已下载，可以在该目录中找到simruntime文件
![alt](http://7vzrbk.com1.z0.glb.clouddn.com/ghost/content/images/2015/09/QQ20150923-2-2x.png)
3. 删除对应模拟器版本
4. 清空目录：`rm -rf ~/Library/Developer/CoreSimulator/Devices`
5. 重启Xcode，让Xcode重新生成模拟器设备.  

## 完全卸载Xcode
终端输入以下命令：`sudo /Developer/Library/uninstall-devtools —mode=all`

## Xcode 6.x的Scheme选项在 OS X El Capitan(10.11)中消失
![](http://7vzrbk.com1.z0.glb.clouddn.com/ghost/content/images/2015/10/Xcode-Scheme-option.png)

### 解决办法
将Xcode的窗口拉长或者全屏就会出现

## Xcode 7.1 无法安装Alcatraz插件
1. 关闭Xcode
2. 移除之前安装的Xcode默认项  
```
defaults delete com.apple.dt.Xcode DVTPlugInManagerNonApplePlugIns-Xcode-7.0
```
3. 卸载Alcatraz  
```
rm -rf ~/Library/Application\ Support/Developer/Shared/Xcode/Plug-ins/Alcatraz.xcplugin
```
4. 移除所有通过Alcatraz安装的包  
```
rm -rf ~/Library/Application\ Support/Alcatraz/
```
5. 更新已安装插件的DVTPlugInCompatibilityUUID到7.1
```
find ~/Library/Application\ Support/Developer/Shared/Xcode/Plug-ins -name Info.plist -maxdepth 3 | xargs -I{} defaults write {} DVTPlugInCompatibilityUUIDs -array-add `defaults read /Applications/Xcode.app/Contents/Info DVTPlugInCompatibilityUUID`
```
6. 重置Xcode Select
`sudo xcode-select --reset`
7. 打开Xcode
8. 安装 Alcatraz
```
curl -fsSL https://raw.github.com/supermarin/Alcatraz/master/Scripts/install.sh | sh
```
9. 重启Xcode
10. 选择"Load Bundles"启动Xcode

## Xcode 安装编译后的.app文件
**安装之前需要启动iOS模拟器。**  

```
$ [Xcode安装路径]/Contents/Developer/usr/bin/simctl install booted [要安装的APP路径]
```
**示例命令：**

```
$ /Applications/Xcode.app/Contents/Developer/usr/bin/simctl install booted ~/Desktop/Examine.app
```


