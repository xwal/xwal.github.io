title: Mac OS 10.11 Openfire安装
date: 2015-11-03 23:31:21
tags: 
- Openfire
- XMPP
categories: MacOS
---

# Mac OS 10.11 Openfire无法启动问题
安装好[openfire_3_10_2.dmg](http://www.igniterealtime.org/downloads/#)后，无法通过【系统偏好设置】中的Openfire图标启动服务器。  
1、JDK版本：1.8.65。经测试需要JDK 1.7版本以上。  
2、Openfire版本：3.10.2  

最终解决办法：在终端中执行命令   
```bash
sudo su
cd /usr/local/openfire/bin
export JAVA_HOME=`/usr/libexec/java_home`
sh ./openfire.sh
```

# 卸载Openfire  
只需要在openfire关闭的情况下，执行以下的命令即可：  
```bash
sudo rm -rf /Library/PreferencePanes/Openfire.prefPane
sudo rm -rf /usr/local/openfire
sudo rm -rf /Library/LaunchDaemons/org.jivesoftware.openfire.plist
```


