title: Objective-C Swizzle
date: 2016-10-26 21:05:50
updated: 2016-10-26 21:05:50
tags:
- Objective-C
- Swizzle
categories: iOS
---

**更新日志**

Swizzle 是 Objective-C 运行时的黑魔法之一。我们可以通过 Swizzle 的手段，在运行时对某些方法的实现进行替换，这是 Objective-C 甚至说 Cocoa 开发中最为华丽，同时也是最为危险的技巧之一。Swizzle 使用了 Objective-C 的动态派发，对于 NSObject 的子类是可以直接使用的。

## 代码实现

<script src="https://gist.github.com/chaoskyme/4758787cda11d473c2abdf3ef5c63d67.js"></script>

## 示例demo

demo 中实现了通过 Swizzle 的方式统计应用内所有按钮的点击次数。

代码下载地址：<https://github.com/chaoskyme/Demo/tree/master/SwizzleDemo>


