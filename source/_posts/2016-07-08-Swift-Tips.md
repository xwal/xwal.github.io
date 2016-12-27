title: Swift Tips
date: 2016-07-08 11:37:38
updated: 2016-12-26
tags:
- Swift
- Tips
categories: iOS
---

**更新日志**

- 更新日期：2016-07-08

## 1. Swift 命令行程序接收用户输入
```
// 标准输入设备
let stdin = NSFileHandle.fileHandleWithStandardInput()
let inputData = keyboard.availableData
var inputStr = NSString(data: inputData, encoding: NSUTF8StringEncoding)
// 处理换行符
inputStr = inputStr?.stringByReplacingOccurrencesOfString("\n", withString: "")
```

## 2. 获取变量内存地址

**unsafeAddressOf(_:)**

返回类对象的指针，类型为`UnsafePointer`
> 函数原型
> func unsafeAddressOf(_ object: AnyObject) -> UnsafePointer<Void>

示例代码
```
var str = "Hello, playground"
print(unsafeAddressOf(str))
// 0x00007f859a404ca0
```

**func withUnsafePointer<T, Result>(_: inout T, _: @noescape (UnsafePointer<T>) throws -> Result)**
Invokes body with an UnsafePointer to arg and returns the result. Useful for calling Objective-C APIs that take "in/out" parameters (and default-constructible "out" parameters) by pointer.
> 函数原型
> func withUnsafePointer<T, Result>(_ arg: inout T, _ body: @noescape (UnsafePointer<T>) throws -> Result) rethrows -> Result

示例代码
```
struct Point {
    var x: CGFloat, y: CGFloat
}
var point = Point(x: 10, y: 10)
print(withUnsafePointer(&point) {UnsafePointer<Point>($0)})
// 0x0000000115e3f8d8
```

## Quick Swift Tips and Tricks
![Swift Quick Tips](http://7xooko.com1.z0.glb.clouddn.com/2016-12-26-Swift Quick Tips.png)



