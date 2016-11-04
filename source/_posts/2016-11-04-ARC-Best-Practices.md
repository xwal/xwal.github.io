title: ARC 最佳实践（译文）
date: 2016-11-04 09:06:04
updated: 2016-11-04 09:06:04
tags:
- ARC
- 译文
categories: iOS
---

**更新日志**

英文原文出处：<http://amattn.com/p/arc_best_practices.html>

## 一些可选背景故事：

* 相关文档：[迁移至ARC版本说明](https://developer.apple.com/library/content/releasenotes/ObjectiveC/RN-TransitioningToARC/Introduction/Introduction.html)
* Mike Ash 在他的 [Friday Q&As](http://www.mikeash.com/pyblog/friday-qa-2011-09-30-automatic-reference-counting.html) 也有一篇关于ARC的文章。
* 深入的技术文档在 LLVM 项目的 [CLANG 网站](http://clang.llvm.org/docs/AutomaticReferenceCounting.html)上。

假设你正在使用 iOS 5 或者更高版本，而不是 4。实际上，弱指针是 ARC 中的一个重要工具，所以我不建议在 iOS 4 中使用 ARC。

## 更新注意事项

这份文件自从2011年发布以来，一直在不断更新。最后一次微小的修订是在 2013年发布 iOS 7。

<!-- more -->

## 一般情况

* 纯量类型属性应该使用 **assign**。
	
	```
	@property (nonatomic, assign) int scalarInt;
	@property (nonatomic, assign) CGFloat scalarFloat;
	@property (nonatomic, assign) CGPoint scalarStruct;
	```
* 需要保留或者引用向下对象层次结构的对象属性应该使用 **strong**。

	```
	@property (nonatomic, strong) id childObject;
	```

* 引用向上对象层次结构的对象属性应该使用 **weak**。此外，当引用委托对象时，**weak** 是最安全的。
	
	```
	@property (nonatomic, weak) id parentObject;
	@property (nonatomic, weak) NSObject <SomeDelegate> *delegate;
	```
	
* **Blocks** 仍然应该使用 **copy**。
	
	```
	@property (nonatomic, copy) SomeBlockType someBlock;
	```

* 在 **dealloc** 中：
	* 移除观察者
	* 注销通知
	* 设置所有不是 **weak** 的委托为 **nil**
	* 使所有定时器失效（译注：如果定时器是strong的属性，dealloc可能永远都不会被调用，所以定时器失效应该在ViewWillDisappear中完成）

* **IBOutlets** 应该是 **weak**，除了顶层 **IBOutlets**是 **strong**。（译注：使用storyboard（xib不行）创建的vc，会有一个叫_topLevelObjectsToKeepAliveFromStoryboard的私有数组强引用所有top level的对象，所以这时即便outlet声明成weak也没关系）

## 桥接

官方文档：

```
id my_id;
CFStringRef my_cfref;
NSString   *a = (__bridge NSString*)my_cfref;     // Noop cast.
CFStringRef b = (__bridge CFStringRef)my_id;      // Noop cast.
NSString   *c = (__bridge_transfer NSString*)my_cfref; // -1 on the CFRef
CFStringRef d = (__bridge_retained CFStringRef)my_id;  // returned CFRef +1
```

详细解释：

* **__bridge** 对于内存管理是无操作的
* **__bridge_transfer** 用于转换 CFRef 为 Objective-C 对象。ARC 将减少 CFRef 的retain count，因此请确保 CFRef 具有+1 retain count。
* **__bridge_retained** 用于转换 Objective-C 对象为 CFRef。这将有效地给你返回一个 retain count +1的CFRef。 您有责任在未来某个时候调用 CFRef 的 CFRelease。

## NSError
无处不在的 **NSError** 是有点棘手。典型的 Cocoa 约定是它们通过输出参数（也称为间接指针）实现。

在ARC中，输出参数默认是 **__autoreleasing**，应该这样实现:

```
- (BOOL)performWithError:(__autoreleasing NSError **)error
{
    // ... some error occurs ...
    if (error)
    {
        // write to the out-parameter, ARC will autorelease it
        *error = [[NSError alloc] initWithDomain:@"" 
                                            code:-1 
                                        userInfo:nil];
        return NO;
    }
    else
    {
        return YES;
    }
}
```

当使用输出参数时，你应该在 ***error** 对象使用 **__autoreleasing**。

```
NSError __autoreleasing *error = error;
BOOL OK = [myObject performOperationWithError:&error];
if (!OK)
{
    // handle the error.
}
```

如果你忘记 **__autoreleasing**，编译器将会简单地为你插入一个临时的中间自动释放对象。 这是在向后兼容性的压迫性制度下作出的妥协。我看到一些编译器配置不会自动使它们**__autoreleasing**。 对所有新代码包含 **__autoreleasing** 更安全的。

## @autoreleasepool

使用 **@autoreleasepool** 内部循环：
* 迭代很多，很多次
* 创建大量的临时对象

```
// If someArray is huge
for (id obj in someArray)
{
    @autoreleasepool
    {
        // or you are creating lots 
        // of temporary objects here...
    }
}
```

使用 **@autoreleasepool** 指令创建和销毁自动释放池比蓝灯特价(译注：blue light special是沃尔玛的一个购物区域)还便宜。不要担心在循环中这样做。如果你超偏执，至少先检查profiler。

## Blocks

一般来说，**blocks** 都能使用。但是有一些例外。

当将 **block** 指针添加到集合时，你首先得复制它们。

```
someBlockType someBlock = ^{NSLog(@"hi");};
[someArray addObject:[someBlock copy]];
```

**blocks** 的循环引用有些危险。你可能看到过这个警告：

```
warning: capturing 'self' strongly in this 
block is likely to lead to a retain cycle 
[-Warc-retain-cycles,4]

SomeBlockType someBlock = ^{
    [self someMethod];
};
```

原因是 **someBlock** 被 self 强引用，并且当 **block** 拷贝到堆中时将捕获并且 retain  **self**。

使用任何实例变量也将捕获父对象，同样有不太明显的潜在循环引用：

```
// The following block will retain "self"
SomeBlockType someBlock = ^{
    BOOL isDone = _isDone;  // _isDone is an ivar of self
};
```

更安全，但令人愉快的解决办法是使用 **weakSelf**：

```
__weak SomeObjectClass *weakSelf = self;

SomeBlockType someBlock = ^{
    SomeObjectClass *strongSelf = weakSelf;
    if (strongSelf == nil)
    {
        // The original self doesn't exist anymore.
        // Ignore, notify or otherwise handle this case.
    }
    else
    {
        [strongSelf someMethod];
    }
};
```

有时，你需要注意避免使用任意对象的循环引用：如果 **someObject** 强引用 **someObject** 的 **block**，你需要使用 **weakSomeObject** 打破循环引用。

```
SomeObjectClass *someObject = ...
__weak SomeObjectClass *weakSomeObject = someObject;

someObject.completionHandler = ^{
    SomeObjectClass *strongSomeObject = weakSomeObject;
    if (strongSomeObject == nil)
    {
        // The original someObject doesn't exist anymore.
        // Ignore, notify or otherwise handle this case.
    }
    else
    {
        // okay, NOW we can do something with someObject
        [strongSomeObject someMethod];
    }
};
```

## 从NS对象或者UI对象访问CGRef

```
UIColor *redColor = [UIColor redColor]; 
CGColorRef redRef = redColor.CGColor;
// do some stuff with redRef.
```

上面的例子有一些非常微妙的问题。当你创建 **redRef**，如果 **redColor** 不再使用，那么**redColor** 就在注释代码之后被销毁。

问题是 **redColor** 持有 **redRef**，并且当访问 **redRef**，它可能或者可能不再是 **colorRef**。更糟的是，这种类型的错误很少出现在模拟器上。当在较低工作内存的设备（比如：早期的iPad）上使用时，更有可能发生。

有几个解决办法。基本上都是当你在使用 **redRef** 时，保证 **redColor** 不会被释放。

一种非常简单的实现就是使用 **__autoreleasing**。

```
UIColor * __autoreleasing redColor = [UIColor redColor];
CGColorRef redRef = redColor.CGColor;
```

现在，**redColor** 不会被销毁，直到方法返回后某个不确定的时间，都能很好地使用。 我们可以安全地在方法的作用域使用 **redRef**。

另一个方法是 retain **redRef**：

```
UIColor *redColor = [UIColor redColor];
CGColorRef redRef = CFRetain(redColor.CGColor);
// use redRef and when done release it:
CFRelease(redRef);
```

重要提示：你需要 在使用**redColor.CGColor** 的同一行使用 **CFRetain()**。**redColor** 在上次使用之后有效地被破坏。以下方式不会有用：

```
UIColor *redColor = [UIColor redColor];
CGColorRef redRef = redColor.CGColor; // redColor is released right after this...
CFRetain(redRef);  // This may crash...
...
```

上面标有“This may crash”一行是一个有趣的注释。再次，我的经验里在模拟器上它不会经常崩溃，但在实际的iOS设备上100%崩溃。开发者请注意。

The Big Nerd Ranch 对这个问题有非常深入的探讨: <http://weblog.bignerdranch.com/?p=296>

## Singletons

仅仅偶然地与ARC有关。本地生成的单例实现是一种激增。（许多不必要的重写 retain 和 release）

这些都应该被替换为以下代码：

```
+ (MyClass *)singleton
{
    static MyClass *sharedMyClass = nil;
    static dispatch_once_t once = 0;
    dispatch_once(&once, ^{sharedMyClass = [[self alloc] init];});
    return sharedMyClass;
}
```

每一次你需要销毁单例的能力。如果你使用这个除了 UnitTests，你可能不再使用单例。

```
// declare the static variable outside of the singleton method
static MyClass *__sharedMyClass = nil;

+ (MyClass *)singleton
{
    static dispatch_once_t once = 0;
    dispatch_once(&once, ^{__sharedMyClass = [[self alloc] init];});
    return __sharedMyClass;
}

// For use by test frameworks only!
- (void)destroyAndRecreateSingleton
{
    __sharedMyClass = [[self alloc] init];
}
```

## 译者后记

第一次翻译，请大家多多指教。


