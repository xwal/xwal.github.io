title: Method Dispatch in Swift
tags: Swift
categories: iOS
---

```swift
class A<T> {
    func print() {
        Swift.print("A")
    }
}

typealias TestA = A<String>

extension TestA {
    func print() {
        Swift.print("TestA")
    }
}
```
