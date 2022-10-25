---
layout: post
title: "Qt读取MS-Word文档内容"
date: 2014-10-13 22:09:57 +0800
updated: 2014-10-13 22:09:57 +0800
comments: true
categories: Qt
tags: ActiveX
---
Qt读取MS Word/Excel/Powerpoint等主要通过ActiveQt来实现。实际上是调用MS Word的ActiveX APIs。  
一下代码是读取word中的所有的文本。
```c++
QAxObject wordApplication("Word.Application");
QAxObject *documents = wordApplication.querySubObject("Documents");
QAxObject* document = documents->querySubObject("Open(const QString&, bool)", m_strWordFilePath, true);
QAxObject* words  = document->querySubObject("Words");
QString textResult;
int countWord = words->dynamicCall("Count()").toInt();
for (int a = 0; a <= countWord; a++){
	textResult.append(words->querySubObject("Item(int)", a)->dynamicCall("Text()").toString());
}
wordApplication.dynamicCall("Quit (void)");
```
详细介绍：  
Word程序初始化：`QAxObject wordApplication("Word.Application")`也可以通过`QAxWidget wordApplication("Word.Application")`，都是初始化com组件对象。  
word程序的子对象可以通过`QAxBase::querySubObject()`来获得。  
e.g:`QAxObject *documents = wordApplication.querySubObject("Documents");`  
任何涉及到word对象的方法调用都可以通过`QAxBase::dynamicCall ()`来实现。  
e.g:`activeDocument->dynamicCall("Close(void)");`  
参考链接：  
<http://qt-project.org/wiki/Using_ActiveX_Object_in_QT>
<http://qt-project.org/wiki/Handling_Document_Formats>  
<http://qt-project.org/wiki/Handling_Microsoft_Word_file_format>
<https://qt-project.org/search/tag/ms~word>
<http://qt-project.org/forums/viewthread/20341>
