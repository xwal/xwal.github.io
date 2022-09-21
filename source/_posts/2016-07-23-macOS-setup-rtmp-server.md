title: macOS 搭建 RTMP 直播服务器
date: 2016-07-23 12:13:06
tags:
- 直播
- RTMP
categories: MacOS
---
直播开发流程:
数据采集→ 数据编码 → 数据传输(流媒体服务器) → 解码数据 → 播放显示  
本文主要介绍如何搭建RTMP直播服务器以及测试流媒体服务器是否搭建成功。

<!-- more -->

## RTMP直播服务器搭建


1. 安装Homebrew

   ```shell
   $ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
   ```

2. Homebrew添加nginx套件

   ```shell
   $ brew tap homebrew/nginx
   ```

3. 安装 nginx 和 rtmp 模块

   ```
   $ brew install nginx-full --with-rtmp-module
   ```

4. 查看 nginx 安装信息

   ```
   $ brew info nginx-full
   ...
   ...
   Docroot is: /usr/local/var/www

     The default port has been set in /usr/local/etc/nginx/nginx.conf to 8080 so that
     nginx can run without sudo.

     nginx will load all files in /usr/local/etc/nginx/servers/.

   - Tips -
   Run port 80:
    $ sudo chown root:wheel /usr/local/Cellar/nginx-full/1.10.1/bin/nginx
    $ sudo chmod u+s /usr/local/Cellar/nginx-full/1.10.1/bin/nginx
   Reload config:
    $ nginx -s reload
   Reopen Logfile:
    $ nginx -s reopen
   Stop process:
    $ nginx -s stop
   Waiting on exit process
    $ nginx -s quit

   To have launchd start homebrew/nginx/nginx-full now and restart at login:
     brew services start homebrew/nginx/nginx-full
   Or, if you don't want/need a background service you can just run:
     nginx
   ```

   从以上信息可以得出

   nginx 安装位置：`/usr/local/Cellar/nginx-full/1.10.1`

   nginx 配置文件位置：`/usr/local/etc/nginx/nginx.conf`

    nginx服务器根目录位置：`/usr/local/var/www`

5. 测试是否能成功启动nginx服务

   ```
   $ nginx
   ```

   在浏览器地址栏输入：<http://localhost:8080>，出现 **Welcome to nginx!** 表示nginx安装成功了！

6. 修改`nginx.conf`配置文件，配置`rtmp`

   在`http`节点后面添加rtmp配置

   ```
   http {
       ……
   }

   rtmp {
       server {
           listen 1935;

           application mytv {
               live on;
               record off;
           }
       }
   }
   ```

7. 重新加载nginx的配置文件

   ```
   $ nginx -s reload
   ```
   现在我们可以来对推流进行测试了，看看我们的rtmp能不能推流成功。

## 测试服务器

### 推流

推流可以使用OBS软件和FFmpeg工具。

#### OBS

软件下载地址：<https://obsproject.com>

软件设置如图：
![Snip20160723_1](2016-07-23-Snip20160723_1.png)
![Snip20160723_2](2016-07-23-Snip20160723_2.png)
#### ffmpeg

安装ffmpeg

```
$ brew install ffmpeg
```

使用ffmpeg命令推流桌面

```
$ ffmpeg -f avfoundation -i "1:0" -vcodec libx264 -preset ultrafast -acodec aac -f flv rtmp://localhost:1935/mytv/room1
```

以上命令中`"1:0"`可以通过查看ffmpeg是否支持对应的设备

```
$ ffmpeg -f avfoundation -list_devices true -i ""
...
...
[AVFoundation input device @ 0x7fd3a9500b40] AVFoundation video devices:
[AVFoundation input device @ 0x7fd3a9500b40] [0] FaceTime HD Camera
[AVFoundation input device @ 0x7fd3a9500b40] [1] Capture screen 0
[AVFoundation input device @ 0x7fd3a9500b40] AVFoundation audio devices:
[AVFoundation input device @ 0x7fd3a9500b40] [0] Built-in Microphone
```

### 拉流

测试拉流可以使用VLC软件

软件下载地址：<http://www.videolan.org/vlc/index.html>

选择File -> Open Network...

![Snip20160723_4](2016-07-23-Snip20160723_4.png)



