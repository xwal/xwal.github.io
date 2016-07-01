---
layout: post
title: "降低QtWebkit内存使用量"
date: 2014-11-05 22:30:50 +0800
comments: true
categories: Qt
tags:
- webkit
---
在QtWebkit的QWebView加载网页的时候，会随着每加载一次网页内存就会增加。为解决这个问题可以通过以下代码解决。  
```c++
QWebSettings::globalSettings()->setAttribute(QWebSettings::AutoLoadImages, false);
QWebSettings::globalSettings()->setMaximumPagesInCache(0);
QWebSettings::globalSettings()->setObjectCacheCapacities(0, 0, 0);
QWebSettings::globalSettings()->setOfflineStorageDefaultQuota(0);
QWebSettings::globalSettings()->setOfflineWebApplicationCacheQuota(0);
QWebSettings::globalSettings()->clearIconDatabase();
QWebSettings::globalSettings()->clearMemoryCaches();
```
其中  
`QWebSettings::globalSettings()->clearIconDatabase();`  `QWebSettings::globalSettings()->clearMemoryCaches();`
可以在下一次加载开始前调用，每次调用后会将上一次加载过的页面内存清空。  

## 详细解析
1. `void QWebSettings::setMaximumPagesInCache(int pages)`  
设置在内存中缓存的最大页数为`pages`。缓存页可以在浏览历史页面的时候提供更好的用户体验。  
详细介绍参考：<http://webkit.org/blog/427/webkit-page-cache-i-the-basics/>  

2. `void QWebSettings::setObjectCacheCapacities(int cacheMinDeadCapacity, int cacheMaxDead, int totalCapacity)`  
指定已死对象的内存容大小。已死包括stylesheets和scripts。  
`cacheMinDeadCapacity`指定当缓存在压力下，已死对象消耗的最小字节数。  
`cacheMaxDead` 是当缓存没在压力下，已死对象应该消耗的最大字节数。  
`totalCapacity` 指定缓存全部消耗的最大字节数。  
缓存默认是开启的。通过`setObjectCacheCapacities(0, 0, 0)`来禁用缓存。设置非零来开启。

3. `void QWebSettings::setOfflineStorageDefaultQuota(qint64 maximumSize)`  
设置新的离线存储数据库的默认最大值为`maximumSize`。

4. `void QWebSettings::setOfflineWebApplicationCacheQuota(qint64 maximumSize)`  
设置离线web应用的缓存最大值为`maximumSize`。

5. `void QWebSettings::clearIconDatabase()`  
清除图标数据库。

6. `void QWebSettings::clearMemoryCaches()`  
通过JavaScript垃圾回收器和清空比如页面、对象和字体等缓存，尽可能多地释放内存。  

## Webkit Page Cache机制
<https://www.webkit.org/blog/427/webkit-page-cache-i-the-basics/>  
<https://trac.webkit.org/wiki/MemoryCache>  

## 参考链接
<http://qt-project.org/forums/viewthread/11105>  
<http://webkit.sed.hu/content/disabling-cache>
