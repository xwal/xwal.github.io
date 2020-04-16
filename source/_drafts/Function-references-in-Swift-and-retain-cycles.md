title: Function references in Swift and retain cycles
tags: Swift
categories: iOS
---

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
        let handler = unown(self, ClassB.commandAction)
        a.handle(commandHandler: handler)
    }
    
    deinit {
        print("deinit ClassB")
    }
    
    func commandAction() {
        
    }
}

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
