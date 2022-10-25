---
layout: post
title: "XULRunner桌面应用解决方案"
date: 2014-09-10 19:29:58 +0800
updated: 2014-09-10 19:29:58 +0800
comments: true
categories: Windows
tags:
- XULRunner
- XUL
---
XULRunner 可以通过运用 Web 开发技术构建桌面应用程序。它提供了丰富的 UI 部件集，使用 XUL，可以直接与 HTML 混合使用并可大量使用 JavaScript。  
## 基本概念 ##
### [XULRunner](https://developer.mozilla.org/en-US/docs/Mozilla/Projects/XULRunner) ###
XULRunner是Mozilla运行包，可以启动类似Firefox和Tunderbird这样多功能的XUL+XPCOM结合的程序。它为程序提供安装、升级、删除机制。 XULRunner还会提供libxul, 它允许其它项目或产品嵌入使用谋智(Mozilla)技术。
### [XUL](https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XUL) ###
XUL是一个Mozilla使用XML来描述用户界面的一种技术，使用XUL你可以快速的创建出跨平台，基于因特网的应用程序。基于XUL技术的应用程序可以很方便的使用好看的字体、图形以及方便的界面布局，而且也更容易部署和定制。如果程序员已经熟悉了Dynamic HTML (DHTML)，那学习XUL将是更容易的事，也可以更快的开发基于XUL的应用程序。
### [XPCOM](https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XPCOM) ###
XPCOM（Cross Platform Component Object Model）是一种跨平台组件对象模型，其原理与微软的COM技术类似，它支持多种语言绑定（Language Bindings）。也就是说，我们可以使用C++、JAVA、JavaScript、Python、Ruby、Perl等语言来编写组件。而XPCOM的接口是用一种叫做XPIDL的IDL（Interface Description Language）来定义的。  
XPCOM 本身提供了一套核心的组件和类，用于诸如内存管理，线程，基本数据结构（strings, arrays, variants）等 。但是大部分的XPCOM组件并不是这个核心库提供的，而是由很多第三方的平台（例如Gecko或者Necko）提供，或者由一个应用，甚至一个扩展提供。  

## 应用程序目录结构 ##
XULRunner应用、扩展和主题都共享相同的目录结构，并且这样的目录结构某些时候还可以用于像可安装应用扩展那样的独立XULRunner应用。  
![](http://i.imgur.com/UOhOL86.png)


