title: Objective-C Method Swizzle
date: 2016-10-26 21:05:50
updated: 2016-10-26 21:05:50
tags:
- Objective-C
- Runtime
categories: iOS
---

**更新日志**

Method Swizzle（方法调配、方法混合、方法调和、方法混写） 是 Objective-C 运行时的黑魔法之一。我们可以通过 Swizzle 的手段，在运行时对某些方法的实现进行替换，这是 Objective-C 甚至说 Cocoa 开发中最为华丽，同时也是最为危险的技巧之一。Swizzle 使用了 Objective-C 的动态派发，对于 NSObject 的子类是可以直接使用的。

通过此方案，可以为那些『完全不知道其具体实现的』黑盒方法增加日志记录功能，这非常有助于程序调试。然而，次做法只在调试程序时有用。很少有人在调试程序之外的场合用上述『Method Swillze』来永久改动某个类的功能。不能仅仅因为Objective-C 语言里有这个特性就一定要用它。若是滥用，反而会令代码变得不易读懂且难于维护。

## 代码实现

<script src="https://gist.github.com/chaoskyme/4758787cda11d473c2abdf3ef5c63d67.js"></script>

## 示例demo

demo 中实现了通过 Swizzle 的方式统计应用内所有按钮的点击次数。

代码下载地址：<https://github.com/chaoskyme/Demo/tree/master/SwizzleDemo>


