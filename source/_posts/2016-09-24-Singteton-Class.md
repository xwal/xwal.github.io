title: 单例类
date: 2016-09-24 20:09:24
tags:
- Singteton
categories: iOS
---

## 介绍

单例模式（Singleton Pattern）最简单的设计模式之一。这种类型的设计模式属于创建型模式，它提供了一种创建对象的最佳方式。

这种模式涉及到一个单一的类，该类负责创建自己的对象，同时确保只有单个对象被创建。这个类提供了一种访问其唯一的对象的方式，可以直接访问，不需要实例化该类的对象。

注意：

1、单例类只能有一个实例。

2、单例类必须自己创建自己的唯一实例。

3、单例类必须给所有其他对象提供这一实例。

<!-- more -->

## 实现

我们将创建一个 SingleObject 类。SingleObject 类有它的私有构造函数和本身的一个静态实例。
SingleObject 类提供了一个静态方法，供外界获取它的静态实例。SingletonPatternDemo，我们的演示类使用 SingleObject 类来获取 SingleObject 对象。

![](http://www.runoob.com/wp-content/uploads/2014/08/singleton_pattern_uml_diagram.jpg)

<script src="https://gist.github.com/chaoskyme/23a6095423494752f3bee55c114a2a97.js"></script>

