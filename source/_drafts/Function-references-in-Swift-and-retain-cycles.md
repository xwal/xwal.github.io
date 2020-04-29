title: Swift 中函数的引用以及导致的循环引用场景
tags: Swift
categories: iOS

---

最近写代码遇到一个在Swift 中将函数作为参数传递给闭包时，导致循环引用的场景。

先来看个例子：

```swift
class ClassA {
    
    var commandHandler: () -> Void = { }
    
    init() {
        print("init ClassA")
    }
    
    deinit {
        print("deinit ClassA")
    }
    
    func handle(commandHandler: @escaping () -> Void) {
        self.commandHandler = commandHandler
    }
}

class ClassB {
    let a: ClassA
    init(a: ClassA) {
        print("init ClassB")
        self.a = a
        a.handle(commandHandler: commandAction)
    }
    
    deinit {
        print("deinit ClassB")
    }
    
    func commandAction() {
        
    }
}
```


### 解决办法

```
func unown<T: AnyObject, V>(_ instance: T, _ classFunction: @escaping (T) -> (() -> V)) -> () -> V {
    return { [unowned instance] in classFunction(instance)() }
}

func unown<T: AnyObject, U, V>(_ instance: T, _ classFunction: @escaping (T) -> ((U) -> V)) -> (U) -> V {
    return { [unowned instance] in classFunction(instance)($0) }
}
```



### 参考链接

* <https://sveinhal.github.io/2016/03/16/retain-cycles-function-references/>
* <https://xebia.com/blog/function-references-in-swift-and-retain-cycles/>
* <https://forums.swift.org/t/implicit-retain-cycle/15238>
