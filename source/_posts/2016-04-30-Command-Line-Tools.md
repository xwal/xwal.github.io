title: Command Line Tools
date: 2016-04-30 22:11:50
tags: Tools
categories: Unix/Linux
---
## 只显示子目录、不显示文件，可以使用下面的命令。
```
# 只显示常规目录
$ ls -d */
$ ls -F | grep /
$ ls -l | grep ^d
$ tree -dL 1

# 只显示隐藏目录
$ ls -d .*/

# 隐藏目录和非隐藏目录都显示
$ find -maxdepth 1 -type d
```
> 来自runyf

## Git常用命令速查表

![](https://dn-coding-net-production-pp.qbox.me/100e4dc6-0317-409f-9ff9-935890315137.jpg)
> 来自Coding

## 清除缓存命令
```
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```


