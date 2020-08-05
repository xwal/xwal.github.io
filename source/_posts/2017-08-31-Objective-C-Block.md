title: Objective-C Block 分析
date: 2017-08-31 21:38:29
tags: Block
categories: iOS
---

## 分析工具：clang

```
clang -rewrite-objc test.m

// UIKit
clang -x objective-c -rewrite-objc -isysroot /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneSimulator.platform/Developer/SDKs/iPhoneSimulator.sdk xxxxx.m
```

## block 的数据结构定义

![](http://blog.devtang.com/images/block-struct.jpg)



对应的结构体定义如下：

```
struct Block_descriptor {
    unsigned long int reserved;
    unsigned long int size;
    void (*copy)(void *dst, void *src);
    void (*dispose)(void *);
};

struct Block_layout {
    void *isa;
    int flags;
    int reserved;
    void (*invoke)(void *, ...);
    struct Block_descriptor *descriptor;
    /* Imported variables. */
};
```

## block 的三种类型

1. _NSConcreteGlobalBlock 全局的静态 block，不会访问任何外部变量。
2. _NSConcreteStackBlock 保存在栈中的 block，当函数返回时会被销毁。
3. _NSConcreteMallocBlock 保存在堆中的 block，当引用计数为 0 时会被销毁。

![](http://file.blog.chaosky.tech/1155481-5436194b4c0899b8.png)

block对变量的捕获规则：

1. 静态存储区的变量：例如全局变量、方法中的static变量
	引用，可修改。

2. block接受的参数
	传值，可修改，和一般函数的参数相同。

3. 栈变量 (被捕获的上下文变量)
	const，不可修改。 当block被copy后，block会对 id类型的变量产生强引用。
	每次执行block时,捕获到的变量都是最初的值。

4. 栈变量 (有__block前缀)
	引用，可以修改。如果时id类型则不会被block retain,必须手动处理其内存管理。
	如果该类型是C类型变量，block被copy到heap后,该值也会被挪动到heap

## 变量的复制

对于 block 外的变量引用，block 默认是将其复制到其数据结构中来实现访问的。

![](http://blog.devtang.com/images/block-capture-1.jpg)

对于用 __block 修饰的外部变量引用，block 是复制其引用地址来实现访问的。

![](http://blog.devtang.com/images/block-capture-2.jpg)

## 嵌套block

```
- (void)setUpModel{
    XYModel *model = [XYModel new];

    __weak typeof(self) weakSelf = self;
    model.dataChanged = ^(NSString *title) {
        __strong typeof(self) strongSelf = weakSelf;
        strongSelf.titleLabel.text = title;

        __weak typeof(self) weakSelf2 = strongSelf;
        strongSelf.model.dataChanged = ^(NSString *title2) {
            __strong typeof(self) strongSelf2 = weakSelf2;
            strongSelf2.titleLabel.text = title2;
        };
    };

    self.model = model;
}
```

这样，就避免的引用循环，总结一下，不管都多少个block嵌套，皆按此法

## @weakify, @strongify 使用

<script src="https://gist.github.com/chaoskyx/041628148019749e13f49756010eea94.js"></script>

1. weakify(self)展开后是: **weak typeof(self) **weak_self = self;

2. strongify(self)展开后是：**strong typeof(self) self = **weak_self;

3. 在block中使用strongify(self);的目的是确保在block作用域内self不会被其它线程释放掉

4. 以前我们在block中直接使用__weak_self来解除循环引用。这本身没有问题，之所以还要加strongify(self)就是为了避免block中代码执行过程中由于其它线程释放了self导致block内执行的逻辑出现问题。例如：会出现执行前几句代码时访问self还是存在的，但后面的self调用已经变为nil了

5. 如果是在block外部定义strongify(self)虽然在block中的self还是指向(跳转到定义)这个strongify(self)。但因为方法调用结束后strongify(self)定义的局部self变量被释放了，所以这种做法就回退到了[4]

6. 由5可知，如果block中有多个嵌套的block异步调用，那么每一个block中都要再定义一个strongify(self);

7. 虽然在多层嵌套的block中，定义weakify(self)也是可行的。但是不推荐这么做

8. swift中使用unowned和weak来解决循环引用问题，基本原理同OC。但unowned本质上是__unsafe_unretained即assign，所以使用起来要小心野指针。还是推荐无脑用weak

9. 不过要达到[3]中的效果，就要在当前closure的作用域内retain下self，只不过有个小麻烦是没法像OC中写的那么自然——不能使用self了。例子如下：

   ```
    obj.doSomething {[weak self] in
      if let strong_self = self {
          strong_self.Member_XXX
      }
    }
   ```

总结：多层嵌套的block，只需要对最外层block传入的`self`进行weak化即可。

## 参考文章

1. [谈Objective-C block的实现](http://blog.devtang.com/2013/07/28/a-look-inside-blocks/)
2. [ block没那么难（一）：block的实现](https://www.zybuluo.com/MicroCai/note/51116)
3. [ block没那么难（二）：block和变量的内存管理](https://www.zybuluo.com/MicroCai/note/57603)
4. [ block没那么难（三）：block和对象的内存管理](https://www.zybuluo.com/MicroCai/note/58470)
5. [深入研究Block捕获外部变量和__block实现原理](http://www.jianshu.com/p/ee9756f3d5f6#)
6. [深入研究Block用weakSelf、strongSelf、@weakify、@strongify解决循环引用](http://www.jianshu.com/p/701da54bd78c)
7. [iOS 中的 block 是如何持有对象的](http://draveness.me/block-retain-object.html)
8. [objc 中的 block](http://blog.ibireme.com/2013/11/27/objc-block/)
9. [iOS开发之block终极篇](http://www.90159.com/2015/08/04/ios-block-ultimate/)
10. [iOS Block用法和实现原理](http://www.wangjiawen.com/ios/ios-block-usage-and-implementation)
11. [OC高级编程——深入block，如何捕获变量，如何存储在堆上](http://www.cnblogs.com/iOS-mt/p/4227336.html)
12. [A look inside blocks: Episode 1](http://www.galloway.me.uk/2012/10/a-look-inside-blocks-episode-1/)
13. [A look inside blocks: Episode 2](http://www.galloway.me.uk/2012/10/a-look-inside-blocks-episode-2/)
14. [A look inside blocks: Episode 3](http://www.galloway.me.uk/2013/05/a-look-inside-blocks-episode-3-block-copy/)
15. [对 Objective-C 中 Block 的追探](http://www.cnblogs.com/biosli/archive/2013/05/29/iOS_Objective-C_Block.html)
16. [LLVM 中 block 实现源码](https://opensource.apple.com/source/libclosure/libclosure-63/)
17. [objective-c-blocks-quiz](http://blog.parse.com/2013/02/05/objective-c-blocks-quiz/)
18. [Which Clang Warning Is Generating This Message?](http://fuckingclangwarnings.com)
19. [iOS 内存泄漏分析](http://www.jianshu.com/p/bc15591784ce)

