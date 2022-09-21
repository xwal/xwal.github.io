---
layout: post
title: "Ubuntu下sublime text 中文输入"
date: 2014-08-19 17:39:02 +0800
comments: true
categories: Linux
tags: 
- Sublime Text
- 中文输入
---

## 首先安装fcitx输入法。  
```
sudo apt-get install fcitx fcitx-config-gtk fcitx-sunpinyin fcitx-googlepinyin fcitx-module-cloudpinyin
sudo apt-get install fcitx-table-all
sudo apt-get install im-switch
im-switch -s fcitx -z default
```
可以选择安装搜狗拼音输入法。[下载地址](http://pinyin.sogou.com/linux/)  

## 安装C/C++的编译环境和gtk libgtk2.0-dev  
```
sudo apt-get install build-essential libgtk2.0-dev
```
<!--more-->
## 编译sublime-imfix.c文件

<script src="https://gist.github.com/xwal/ad79f1090c00b2c649d3.js"></script>

### 编译共享内库  
    gcc -shared -o libsublime-imfix.so sublime_imfix.c `pkg-config --libs --cflags gtk+-2.0` -fPIC

### 拷贝共享内库到程序目录  
	sudo cp libsublime-imfix.so /opt/sublime_text/

## 修改命令subl和启动图标

### 修改命令subl  
    sudo vim /usr/bin/subl
将
    #!/bin/sh
    exec /opt/sublime_text/sublime_text "$@"
修改为
    #!/bin/sh
    LD_PRELOAD=/opt/sublime_text/libsublime-imfix.so exec /opt/sublime_text/sublime_text "$@"  

### 修改启动图表  
    sudo vim /usr/share/applications/sublime-text.desktop  

修改部分  
将[Desktop Entry]中的字符串

    Exec=/opt/sublime_text/sublime_text %F  
修改为  

    Exec=sh -c "LD_PRELOAD=/opt/sublime_text/libsublime-imfix.so exec /opt/sublime_text/sublime_text %F"  

将[Desktop Action Window]中的字符串

    Exec=/opt/sublime_text/sublime_text -n  
修改为

    Exec=sh -c "LD_PRELOAD=/opt/sublime_text/libsublime-imfix.so exec /opt/sublime_text/sublime_text -n"

将[Desktop Action Document]中的字符串  

    Exec=/opt/sublime_text/sublime_text --command new_file  
修改为  

    Exec=sh -c "LD_PRELOAD=/opt/sublime_text/libsublime-imfix.so exec /opt/sublime_text/sublime_text --command new_file"  


