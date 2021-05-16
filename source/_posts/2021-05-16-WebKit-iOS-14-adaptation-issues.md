title: WebKit的iOS 14 适配问题
date: 2021-05-16 22:20:24
tags:
- WebKit
- WebView
categories: iOS
---

最近在做 iOS 14 的 WebKit API 适配遇到一些问题记录下。

### Fatal error: Bug in WebKit: Received neither result or failure.: file WebKit/WebKitSwiftOverlay.swift, line 66

#### 问题现象

```swift
webView.evaluateJavaScript("console.log('Hello World')", in: nil, in: .page) { result in
    print(result)
}
```
在 iOS 14.0 的版本中执行以上的代码会产生crash  `Fatal error: Bug in WebKit: Received neither result or failure.: file WebKit/WebKitSwiftOverlay.swift, line 66` ，但是在最新版 14.5 不会崩溃。

#### 定位问题

在 WebKit 官方代码[WebKit/WebKit](https://github.com/WebKit/WebKit/blob/debe8769281c735813e0e731a926773642d921e0/Source/WebKit/UIProcess/API/Cocoa/WebKitSwiftOverlay.swift#L66) 中找到了这段产生crash的代码。

```swift
func makeResultHandler<Success, Failure>(_ handler: @escaping (Result<Success, Failure>) -> Void) -> (Success?, Failure?) -> Void {
    return { success, failure in
        if let success = success {
            handler(.success(success))
        } else if let failure = failure {
            handler(.failure(failure))
        } else {
            fatalError("Bug in WebKit: Received neither result or failure.")
        }
    }
}
```

查看源码可知，当 JavaScript 执行没有返回值，也没有错误的时候就会产生fatalError，比如执行`console.log('Hello World')`。

但是在 WebKit 的 main 分支最新代码中已经没有这段代码了，取而代之的是使用 `ObjCBlockConversion.boxingNilAsAnyForCompatibility`。

为了找到是在哪次commit中修复了这个问题，通过查询`WebKitSwiftOverlay.swift`文件的git修改记录，找到有这么一次commit，里面记录了这个crash修复的过程，有兴趣的可以去看看。

<https://github.com/WebKit/WebKit/commit/534def4b8414c5ca1bf3712272ad24eaf271b134#diff-93ac6a04946f8372bfaec900fdcab57ef95932e9f30f45e7115a9ea807b82e6c>

问题已经找到，那就需要确定是在哪个版本的 iOS 中修复了这个问题。

首先需要找到 iOS 版本对应的 WebKit 版本。

在 Wikipedia 上有维护 [Safari version history](https://en.wikipedia.org/wiki/Safari_version_history) Safiri 版本和对应的 WebKit 版本，但是遗憾的是最新版本的 iOS 14 还没有该记录。

那接下来如何找到 WebKit 版本呢？

需要分为两部分，首先先确定Xcode里集成的 iOS 编译库，再确定老版本的 iOS，老版本的iOS可以从Xcode 的 Components 下载对应版本的Simulator。

以 Xcode 12.5 为例。在 `/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Library/Developer/CoreSimulator/Profiles/Runtimes/` 路径下找到 `iOS.simruntime`，再找到 WebKit `Contents/Resources/RuntimeRoot/System/Library/Frameworks/WebKit.framework/WebKit`。

完整路径为：`/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Library/Developer/CoreSimulator/Profiles/Runtimes/iOS.simruntime/Contents/Resources/RuntimeRoot/System/Library/Frameworks/WebKit.framework`。

通过 `otool -L` 命令找到对应的WebKit 版本。

```shell
$ otool -L WebKit | grep WebKit                                      [23:42:54]
WebKit:
	/System/Library/Frameworks/WebKit.framework/WebKit (compatibility version 1.0.0, current version 611.1.21)
	/System/Library/PrivateFrameworks/WebKitLegacy.framework/WebKitLegacy (compatibility version 1.0.0, current version 611.1.21, reexport)
```
其中 611.1.21 就是对应的 WebKit 的版本。

Xcode 通过 Components 下载的 Simulator 版本路径在 `/Library/Developer/CoreSimulator/Profiles/Runtimes` 下，用同样的方式确定 iOS 版本的 WebKit 版本。

| iOS 版本   | WebKit 版本 |
|----------|-----------|
| iOS 14.5 | 611.1.21  |
| iOS 14.4 | 610.4.3   |
| iOS 14.3 | 610.3.7   |
| iOS 14.2 | 610.2.11  |

最后在 [WebKit/Webkit](https://github.com/WebKit/WebKit/blob/safari-610.2.11.0-branch/Source/WebKit/UIProcess/API/Cocoa/WebKitSwiftOverlay.swift) 上确认对应的修复版本，最终确认修复的版本为 iOS 14.3。

#### 总结

对 `evaluateJavaScript` 方法做兼容，不能直接使用 `#available(iOS 14.0, *)` 适配。

```swift
if #available(iOS 14.3, *) {
    webView.evaluateJavaScript("console.log('Hello World')", in: nil, in: .page) { result in
        print(result)
    }
} else {
    webView.evaluateJavaScript("console.log('Hello World')") { value, error in
        print(value)
    }
}
```

