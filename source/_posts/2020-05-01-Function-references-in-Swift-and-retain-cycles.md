title: Swift 中函数的引用以及导致的循环引用场景
tags: Swift
categories: iOS
date: 2020-05-01 14:25:29

---

Swift 的函数作为一等公民，可以赋值给变量，柯里化，也可以作为参数传递（如果将函数作为参数传递给闭包，只要类型匹配，就可以将函数引用代替内联闭包）。我们可以将函数当作带有名称的特殊闭包，但是使用的时候需要当心。

## 0x01 问题

最近遇到一个在 Swift 中将函数作为参数传递给闭包时，导致循环引用的场景。

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
        a.handle(commandHandler: self.commandAction)
    }
    
    deinit {
        print("deinit ClassB")
    }
    
    func commandAction() {
        
    }
}
```

实例化ClassB，这个时候就会产生循环引用导致内存泄漏。

## 0x02 实例函数是柯里化类函数

在Swift中，实例函数只是[柯里化](https://en.wikipedia.org/wiki/Currying)类函数，该类函数将实例作为第一个参数，并隐式地使第一个参数作为`self`可供函数体使用。 因此，以下两个是等价的：

```swift
let numbers = [1, 2, 3, 4, 5, 6, 7, 8]
numbers.contains(3) //true
Array.contains(numbers)(3) //true
```

而且，这些也是等价的：

```swift
let handler1 = self.commandAction
let handler2 = self.dynamicType.commandAction(self)
let handler3 = { [unowned self] in self.commandAction() }
```

## 0x03 可以通过泛型函数来管理内存

如果我们要从上面的 `handler2` 中获取 `self.dynamicType.commandAction`，但是没有参数 `(self)`作为参数传递给了包装函数以便引用 `self`，我们改怎么办呢？ 我们可以通过`unowend`来引用，并将 `unowned` 实例引用传递给类函数获取一个实例函数，而且不会导致循环引用。

```swift
func unown<T: AnyObject, V>(_ instance: T, _ classFunction: @escaping (T) -> (() -> V)) -> () -> V {
    return { [unowned instance] in classFunction(instance)() }
}

func unown<T: AnyObject, U, V>(_ instance: T, _ classFunction: @escaping (T) -> ((U) -> V)) -> (U) -> V {
    return { [unowned instance] in classFunction(instance)($0) }
}
```

这样的话，我们就可以通过以下方式来获取实例方法的引用，而且我们不会强引用`self`。

```swift
let handler4 = unown(self, self.dynamicType.commandAction)
```

缺点是，函数每增加一个参数，我们就需要写一个泛型函数来管理内存。而且，由于使用的是`unowned`管理内存，如果使用不当会导致野指针访问导致崩溃。

### 参考链接

* <https://sveinhal.github.io/2016/03/16/retain-cycles-function-references/>
* <https://xebia.com/blog/function-references-in-swift-and-retain-cycles/>
* <https://forums.swift.org/t/implicit-retain-cycle/15238>
