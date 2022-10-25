title: 使用自定义 Module 解决 Objective-C 库的引用
date: 2020-08-03 21:01:17
updated: 2020-08-03 21:01:17
tags:
- CocoaPods
- Swift
- Objective-C
categories: iOS
---

## LLVM Module

> A module is a single unit of code distribution—a framework or application that is built and shipped as a single unit and that can be imported by another module with Swift’s import keyword.
>
>Each build target (such as an app bundle or framework) in Xcode is treated as a separate module in Swift. If you group together aspects of your app’s code as a stand-alone framework—perhaps to encapsulate and reuse that code across multiple applications—then everything you define within that framework will be part of a separate module when it’s imported and used within an app, or when it’s used within another framework.
>
> As the docs indicate, the module is an application or a framework (library). If you create a project with classes A and B, they are part of the same module. Any other class in the same project can inherit from those classes. If you however import that project to another project, classes from that another project won't be able to subclass A nor B. For that you would have to add open indicator before their declarations.
>
> Basically, if you work on a single app then you are working in one single module and unless declared as private or fileprivate, the classes can subclass each other.


### Module

Module 是一种集成库的方式，在 Module 出现之前，开发者需要在引入库文件的同时引入需要使用的头文件，以保证编译的正常进行。但是每次引入库的时候都要导入一堆文件，看起来并不优雅。Module 和 Framework 的出现让开发者极大程度上告别了这些不优雅的工作。简单说就是用树形的结构化描述来取代以往的平坦式 `#include`， 例如传统的 `#include <stdio.h>` 现在变成了 `import std.io`。

主要好处有：

1. 语义上完整描述了一个框架的作用
2. 提高编译时可扩展性，只编译或 include 一次。避免头文件多次引用，只解析一次头文件甚至不需要解析（类似预编译头文件）
3. 减少碎片化，每个 module 只处理一次，环境的变化不会导致不一致
4. 对工具友好，工具（语言编译器）可以获取更多关于 module 的信息，比如链接库，比如语言是 C++ 还是 C

### modulemap 文件

module.map 文件就是对一个框架，一个库的所有头文件的结构化描述。通过这个描述，桥接了新语言特性和老的头文件。默认文件名是 module.modulemap，modulemap 其实是为了兼容老标准，不过现在 Xcode 里的还都是这个文件名，相信以后会改成新名字。

文件的内容以 Module Map Language 描述，大概语法如下：

```llvm
module MyLib {
  explicit module A {
    header "A.h"
    export *
  }

  explicit module B {
    header "B.h"
    export *
  }
}
```
类似上面的语法，描述了 MyLib、MyLib.A、MyLib.B 这样的模块结构。

官方文档中有更多相关内容，可以描述框架，描述系统头文件，控制导出的范围，描述依赖关系，链接参数等等。这里不多叙述，举个 libcurl 的例子：

```llvm
module curl [system] [extern_c] {
    header "/usr/include/curl/curl.h"
    link "curl"    
    export *
}
```

将此 modulemap 文件放入任意文件夹，通过 Xcode 选项或者命令行参数，添加路径到 import search path （swift 的 -I 参数）。 然后就可以在 Swift 代码里直接通过 import curl 导入所有的接口函数、结构体、常量等。

Xcode 选项位于 Build Settings 下面的 Swift Compiler - Search Paths 。添加路劲即可。


每个Module中必须包涵一个umbrella头文件，这个文件用来import所有这个Module下的文件。

大致关系为：import module -> import umbrella header -> other header

使用 Module 库的调用方式：

| 项目类型   | OC库(GDTPackage)                   | Swift库(GDTPackage)           |
| ---------- | ---------------------------------- | ----------------------------- |
| OC 项目    | \#import <GDTPackage/GDTPackage.h> | \#import <GDTPackage-Swift.h> |
| Swift 项目 | import GDTPackage                  | import GDTPackage             |

`GDTPackage.h` 其实就是 `umbrella header/master header`。

## CocoaPods 自定义 Module

我们以桥接 GDTMobSDK 为例。

### 创建 GDTPackage 库

通过 CocoaPods 提供的命令行创建库：

```shell
$ pod lib create GDTPackage
```

### 创建 module.modulemap 和 BridgeHeader.h

在项目中新建 `module.modulemap` 和 `BridgeHeader.h`，将它们放在同一个文件夹下 `GDTPackage/Module`。

`module.modulemap` 代码如下：

```llvm
module GDTPackageBridge {
    header "BridgeHeader.h"
    export *
}
```

`BridgeHeader.h` 代码如下：

```Objective-C
#import <GDTMobSDK/GDTMobBannerView.h>
#import <GDTMobSDK/GDTRewardVideoAd.h>
#import <GDTMobSDK/GDTNativeExpressAd.h>
#import <GDTMobSDK/GDTNativeExpressAdView.h>
#import <GDTMobSDK/GDTMobInterstitial.h>
#import <GDTMobSDK/GDTSplashAd.h>
```

`GDTPackage.podspec` 部分代码：

```ruby
...
  s.static_framework = true
  s.source_files = 'GDTPackage/Classes/**/*'
  
  s.preserve_paths = ['GDTPackage/Module/module.modulemap', 'GDTPackage/Module/BridgeHeader.h']
  s.pod_target_xcconfig = {
    # 路径根据实际情况进行引用，必须保证路径是正确的
    'SWIFT_INCLUDE_PATHS' => ['$(PODS_ROOT)/GDTPackage/Module', '$(PODS_TARGET_SRCROOT)/GDTPackage/Module']
  }

  s.dependency 'GDTMobSDK'
...
```

### 代码中引用 GDTPackageBridge

```swift
import GDTPackageBridge

class GDTPackage {
    func test() {
        GDTSplashAd.init()
    }
}
```

### 注意事项

1. 如果已经在 `preserve_paths` 添加了 `modulemap` 和 `header`，可以不用在 `source_files` 里再加一遍，如果要在 `source_files` 里加也可以，记得指定 `public_header_files`。如果没有指定，你自己创建的 `modulemap` 也会当做 `public` 处理。这样 `lint` 的时候会报 `Include of non-modular header inside framework module`。

2. `lint` 时遇到 `Include of non-modular header inside framework module` 错误，可以在后面添加 `--use-libraries`。虽然能验证和上传通过，但是其他项目引用的时候还是会有问题。

3. `user_target_xcconfig` 是针对所有 `Pod` 的，可能和其他 `Pod` 存在冲突。`pod_target_xcconfig` 是针对当前 `Pod` 的。

## 参考链接

1. [Modules - Clang 12 documentation](http://clang.llvm.org/docs/Modules.html)