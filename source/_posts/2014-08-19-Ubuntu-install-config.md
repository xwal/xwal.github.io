---
layout: post
title: "Ubuntu安装配置"
date: 2014-08-19 21:02:01 +0800
comments: true
categories: Linux
tags:
- Ubuntu
- 装机
---
## 1.安装flash
从flash官网下载对应的版本的压缩包。(https://www.adobe.com/support/flashplayer/downloads.html)  
解压文件，拷贝文件。
```
sudo cp libflashplayer.so /usr/lib/mozilla/plugins/
sudo cp -r ./usr/* /usr/
```

## 2.安装RVM
```  
curl -L https://get.rvm.io | bash -s stable
source ~/.rvm/scripts/rvm
rvm install 2.0.0
rvm use 2.0.0
/bin/bash --login
```

## 3.安装sublime text 3
```
sudo add-apt-repository ppa:webupd8team/sublime-text-3
sudo apt-get update
sudo apt-get install sublime-text-installer
```

## 4.安装ubuntu-tweak
```
sudo add-apt-repository ppa:tualatrix/ppa
sudo apt-get update
sudo apt-get install ubuntu-tweak
```

## 5.生成ssh密钥
```
ssh-keygen -t rsa -C "chaosky.me@gmail.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
sudo apt-get install xclip
xclip -sel clip < ~/.ssh/id_rsa.pub
```

## 6.配置VPN
(http://www.iqlinkus.net/help.action)

## 7.安装zsh
具体配置参考池老师的[MacTalk的文章《终极shell》](http://macshuo.com/?p=676)

## 8.安装Ubuntu Tweak
最新版本下载地址：<https://launchpad.net/ubuntu-tweak/+download>或使用PPA方式进行安装：  
```
sudo add-apt-repository ppa:tualatrix/ppa
sudo apt-get update
sudo apt-get install ubuntu-tweak
```

## 9.安装星际译王
主页：<http://stardict-4.sourceforge.net/>  
终端安装：`$ sudo apt-get install stardict`
安装词典：<http://abloz.com/huzheng/stardict-dic/>  
下载词典并解压到 ~/.stardict/dic 或 /usr/share/stardict/dic  
现在以安装文件名为stardict-zh-en.tar.bz2 的词典为例：  
```
tar -xjvf stardict-zh-en.tar.bz2
sudo mv stardict-zh-en /usr/share/stardict/dic
```
注意：stardict-zh-en.tar.bz2是词典文件，stardict-zh-en 是解压出来的词典目录
重新启动stardict，新的词典就会被自动加载了。  
安装真人语音库：[WyabdcRealPeopleTTS.tar.bz2](http://sourceforge.net/projects/stardict-4/files/WyabdcRealPeopleTTS/WyabdcRealPeopleTTS.tar.bz2/download)
`sudo tar -xvf WyabdcRealPeopleTTS.tar.bz2 -C /usr/share`


