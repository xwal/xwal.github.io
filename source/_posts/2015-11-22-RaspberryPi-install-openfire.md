title: 树莓派安装Openfire搭建XMPP服务器
date: 2015-11-22 16:44:02
tags:
- Openfire
- Raspberrypi
categories: XMPP
---
### 树莓派基本配置

1. 树莓派设备安装[RASPBIAN](https://www.raspberrypi.org/downloads/raspbian/)系统  

2. 使用raspi-config进行配置  

   参考<http://blog.csdn.net/xdw1985829/article/details/38816375>

3. 更新系统到最新`sudo apt-get update & sudo apt-get upgrade`

### 安装JRE环境

`sudo apt-get install openjdk-7-jre`

### 安装MySQL

`sudo apt-get install mysql-server`

### 安装PHPMyAdmin

`sudo apt-get install phpmyadmin`

### 安装Openfire服务

下载：`wget http://download.igniterealtime.org/openfire/openfire_3.10.3_all.deb`

安装：`sudo dpkg -i openfire_3.10.3_all.deb`

### 打开PHPMyAdmin创建数据库
1. 创建数据库openfire
2. 导入数据库文件openfire_mysql.sql，可以在`/usr/share/openfire/resources/database`目录中，找到每一个对应数据库类型的SQL文件。这个地方我使用的是MySQL。

### 启动Openfire并进行初始设置

通过命令可以对Openfire服务进行启动/停止/重启/强制加载 `/etc/init.d/openfire {start|stop|restart|force-reload}`   

通过启动`sudo /etc/init.d/openfire start`并访问`http://[openfire server ip]:9090`进行初始设置
