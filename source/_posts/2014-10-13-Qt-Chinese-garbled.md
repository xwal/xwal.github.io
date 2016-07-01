---
layout: post
title: "Qt中文乱码"
date: 2014-10-13 21:43:42 +0800
comments: true
categories: Qt
tags: QTextCodec
---
## 解决办法 ##
```c++
    QTextCodec *codec = QTextCodec::codecForName("UTF-8");
    QTextCodec::setCodecForLocale(QTextCodec::codecForLocale());
#if (QT_VERSION <= QT_VERSION_CHECK(5, 0, 0))
    QTextCodec::setCodecForCStrings(QTextCodec::codecForLocale());
    QTextCodec::setCodecForTr(codec);
#endif
```
## 乱码出现的原因 ##
QString内部采用的是 Unicode，它可以同时存放GBK中的字符"我是汉字",BIG5中的字符"扂岆犖趼" 以及Latin-1中的字符"ÎÒÊÇºº×Ö"。  
当你需要从窄字符串 char* 转成Unicode的QString字符串的，你需要告诉QString你的这串char* 中究竟是什么编码？GBK、BIG5、Latin-1？  
在你不告诉它的情况下，它默认选择了Latin-1，于是8个字符"ÎÒÊÇºº×Ö"的unicode码被存进了QString中。最终，8个Latin字符出现在你期盼看到4中文字符的地方，
所谓的乱码出现了。  
网上有很多方法介绍直接在main.cpp里设置：
```c++
QTextCodec *codec = QTextCodec::codecForName("UTF-8");
QTextCodec::setCodecForTr(codec);
QTextCodec::setCodecForLocale(codec);
QTextCodec::setCodecForCStrings(codec);
```
其实这在某些情况下也是有问题的，因为程序可能读到系统的中文路径，或者调用中文路径下的外部程序，这时候如果系统是gb2312就有问题了。  
因为中文路径的编码是采用utf-8存到QString里的，系统读中文路径解码的时候采用的却是系统的gb2312，所以会调不起带中文路径的外部程序。  
以上问题下面方法可以解决：
```c++
    QTextCodec *codec = QTextCodec::codecForName("UTF-8");
    QTextCodec::setCodecForTr(codec);
    QTextCodec::setCodecForLocale(QTextCodec::codecForLocale());
    QTextCodec::setCodecForCStrings(QTextCodec::codecForLocale());
```
对于外部字符串编码解码全部采用本地编码。  
参考链接：<http://blog.csdn.net/brave_heart_lxl/article/details/7186631>
