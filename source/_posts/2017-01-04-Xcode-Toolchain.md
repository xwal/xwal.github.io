title: Xcode 工具链
date: 2017-01-04 16:54:40
tags:
- Xcode
categories: iOS
---

## 写在前面的话

虽然我们来自不同背景、有不同观点，经历不同；虽然我们做事动机不同，信念、偏见和意见使我们彼此分离，有一件事我们是在一起的：

**不管好坏，我们都必须使用 Xcode。**

Xcode 不仅仅只是一个应用程序，在 GUI 之下是一个应用程序和命令行工具的结合，它们与开发人员的工作流程一样是编辑器的核心。

<!-- more -->

## Xcode Tools

### xcode-select

每个人与 Xcode 的旅程从一个选择开始。`xcode-select`提供了这个选择，尽管是一个永恒的问题：『蛋糕或死亡？』

从 Mavericks 开始，在 Mac 上的开发者从执行一条命令开始：

```
$ xcode-select --install
```

将安装命令行工具，编译 Objective-C 代码必备的。

### xcrun

`xcrun` 是 Xcode 基本的命令行工具。使用它可以调用其他工具。

```
$ xcrun xcodebuild
```

除运行命令之外，`xcrun` 可以查找文件和显示 SDK 的路径：

```
$ xcrun --find clang
$ xcrun --sdk iphoneos --find pngcrush
$ xcrun --sdk macosx --show-sdk-path
```

因为 `xcrun` 的执行是基于当前的 Xcode 版本环境（通过 `xcode-select`设置），所以在系统中能存在多个版本的 Xcode 工具链是非常容易的。

在脚本和其他外部工具中使用 `xcrun` 能确保在不同环境中保证一致性。比如，Xcode 附带了代码分发工具 Git。通过调用 `$ xcrun git` 而不是 `$ git`，构建系统可以保证运行正确。

### xcodebuild

第二个最重要的 Xcode 工具是 `xcodebuild`，顾名思义，构建 Xcode project 和 workspace。

不用传递任何构建参数，`xcodebuild` 默认为 Xcode.app 最近使用的 scheme 和 配置：

```
$ xcodebuild
```

然而，任何 scheme、targets、配置、目标设备、SDK和导出数据位置都可以配置：

```
$ xcodebuild -workspace NSHipster.xcworkspace -scheme "NSHipster"
```

有六个可以依次调用的构建操作：

| 操作 | 描述 |
| --- | --- |
| build | 在构建根路径(SYMROOT)构建target。默认构建操作。 |
| analyze | 在构建根路径(SYMROOT)构建和分析target或者scheme。需要指定 scheme。 |
| archive | 在构建根路径（SYMROOT）打包 scheme。需要指定 scheme。 |
| test | 在构建根路径（SYMROOT）测试 scheme。需要指定 scheme和可选指定目标设备。 |
| installsrc | 拷贝工程源到源根路径（SRCROOT）。 |
| install | 构建target、安装到target在目标设备根路径（DSTROOT）的安装目录 |
| clean | 从构建根路径（SYMROOT）移除构建的产品和中间文件  |

### genstrings

`genstrings` 工具从指定的C或者Objective-C源文件生成 `.strings` 文件。在不同的 `locale` 本地化应用程序使用 `.strings` 文件。在苹果的 `Cocoa Core Competencies` 中的 [Internationalization](https://developer.apple.com/library/mac/documentation/general/conceptual/devpedia-cocoacore/- Internationalization.html) 有相关的描述。

```
$ genstrings -a /path/to/source/files/*.m
```

每次在源文件中使用 `NSLocalizedString`，`genstrings` 将会追加 `key` 和 `comment` 到目标文件中。然后由开发人员为每个目标 locale 创建文件的副本， 并将该文件翻译。

fr.lproj/Localizable.strings

```
/* No comment provided by engineer. */

"Username"="nom d'utilisateur";

/* {User First Name}'s Profile */

"%@'s Profile"="profil de %1$@";
```

### ibtool

正如 `genstrings` 作用于源代码，而 `ibtool` 作用于 `XIB` 文件。

```
$ ibtool --generate-strings-file Localizable.strings en.lpoj/Interface.xib
```

本地化是它的主要功能，`ibtool` 还拥有对 `Interface Builder` 文档有效的其他几个功能。

* `--convert`： 更改所有对类名的引用
* `--upgrade`： 将文档升级到最新版
* `--enable-auto-layout`：启用自动布局
* `--update-frames`：更新框架
* `--update-constraints`：更新约束

### iprofiler

`iprofiler` 测量应用程序的性能，而不启动 `Instruments.app`：

```
$ iprofiler -allocations -leaks -T 15s -o perf -a NSHipster
```

上面的命令将附加到 NSHipster 程序，运行15秒，分析内存分配和泄露，然后将结果写入perf文件。之后输出结果可以通过 Instruments.app 读取和显示。

### xed

这个命令可以简单地打开 Xcode。

```
$ xed NSHipster.xcworkspace
```

通过传递 `-w` 参数，`xed` 将等待直到所有打开的窗口关闭。对于脚本化用户交互非常有用，例如提示用户编辑文件并继续一旦完成。

### agvtool

`agvtool` 用于读取和写入 Xcode工程 Info.plist 中的版本号。

```
$ agvtool what-version
```

返回当前版本

```
$ agvtool next-version
```

累加 `CURRENT_PROJECT_VERSION` 和 `DYLIB_CURRENT_VERSION`。传递 `-all` 选项将更新 `Info.plist` 中的 `CFBundleVersion`。

## 其他工具

除了上述的 Xcode 工具以外，还有一些其他用 `xcrun` 调用的程序：

### 编译 & 汇编

* **clang**: 编译 C、C++、Objective-C和 Objective-C 源文件。
* **lldb**: 调试C、C++、Objective-C 和 Objective-C 程序
* **nasm**: 汇编文件
* **ndisasm**: 反汇编文件
* **symbols**: 显示一个文件或者进程的符号信息。
* **strip**: 删除或修改符号表附加到汇编器和链接编辑器的输出。
* **atos**: 将数字内存地址转换为二进制映像或进程的符号。

### 处理器

* **unifdef**: 从代码中移除条件宏 `#ifdef`。
* **ifnames**: 在 C++ 文件中找出所有条件。

### 库

* **ld**: 将目标文件和库合并成一个文件。
* **otool**: 显示目标文件或库的指定部分。
* **ar**: 创建和维护库文档。
* **libtool**: 使用链接器 `ld` 创建库。
* **ranlib**: 更新归档库的目录。
* **mksdk**: 创建和更新 SDK。
* **lorder**: 列出目标文件的依赖。

### 脚本

* **sdef**: 脚本定义提取器
* **sdp**: 脚本定义处理器
* **desdp**: 脚本定义生成器
* **amlint**: 检查 Automator 对问题的操作

### 打包

* **installer**: 安装 OS X 包。
* **pkgutil**: 读取和操纵 OS X 包。
* **lsbom**: 列出 bom（Bill of Mterials）内容。

### 文档

* **headerdoc**: 处理头文档。
* **gatherheaderdoc**: 编译和链接 `headerdoc` 输出。
* **headerdoc2html**: 从 `headerdoc` 输出生成 HTML。
* **hdxml2manxml**: 从 `headerdoc` XML 输出翻译成被 `xml2man` 使用的文件。
* **xml2man**: 将 `Man Page Generation Language（MPGL）` XML文件转换为手册页。

### Core Data

* **momc**: 编译 `Managed Object Model(.mom)`文件
* **mapc**: 编译 `Core Data Mapping Model(.xcmappingmodel)`文件

## 第三方工具

### appledoc

Cocoa 开发人员认为 Objective-C 的冗长有助于自注释代码。在 `longMethodNamesWithNamedParameters:` 和 明确的参数类型。Objective-C 方法不会留下太多的想象力。

但是即使自注释代码也可以通过文档来改进，只用少量的努力就能够对他人产生显著的益处。

在 Objective-C 中，选择的文档工具是 `appledoc`。使用 `javadoc` 类似的语法，`appledoc` 能够从 .h文件生成 HTML 和 Xcode 兼容的 .docset 文档，看起来几乎和苹果官方文档完全相同。

Objective-C 文档由任何 `@interface` 或 `@protocol` 之前的 `/** */` 注释块（注意额外的初始星号）以及任何方法或 `@property` 声明指定。文档还可能包含系统字段的标签，如参数或返回值：

* **@param [param] [Description]**: 描述应传递什么值或此参数
* **@return [Description]**: 描述方法的返回值
* **@see [selector]**: 提供 『参见』相关项目的参考
* **@discussion [Discussion]**: 提供额外的背景资料
* **@warning [Description]**: 调用异常或潜在的危险行为

`appledoc` 可以通过以下命令安装：

```
$ brew install appledoc
```

要生成文档，需要在 Xcode 工程的根目录下执行 `appledoc` 命令，传递元数据比如工程名和公司名：

```
$ appledoc --project-name CFHipsterRef --project-company "NSHipster" --company-id com.nshipster --output ~/Documents .
```

从目标目录中找到的头文件中生成并安装一个Xcode .docset文件。

通过传递 `--help` 参数可以找到其他配置选项（包括HTML输出）：

```
$ appledoc --help
```

### xctool

它可以直接替代 xcodebuild，也就是 Xcode.app 自己所依赖的底层工具。

我们自己作为苹果硬件和软件的消费者，都清楚设计的重要性怎么强调都不为过。在这个方面，xctool 做得非常漂亮。构建过程的每一步都经过清晰的组织，使用 ANSI 彩色字符和一系列 Unicode 装饰字符，使得表现的方式既容易理解又具有视觉吸引力，同时 xctool 的美丽不仅仅体现了表面：构建过程同样支持以其他工具可读取的格式进行输出：

```
$ xctool -reporter plain:output.txt build
```
* **pretty**: (默认) 一个文字化的输出器，使用 ANSI 颜色和 unicode 符号来进行美化输出。
* **plain**: 类似 pretty, 不过没有颜色和 Unicode。
* **phabricator**: 把构建/测试的结果输出为 JSON 数组，它可以被 Phabricator 的代码评审工具读取。
* **junit**: 把测试结果输出成和 JUnit/xUnit 兼容的 XML 文件。
* **json-stream**: 一个由构建/测试事件组成的 JSON 字典流，每行一个（示例输出）。
* **json-compilation-database**: 输出构建事件的 JSON Compilation Database ，它可以用于基于 Clang Tooling 的工具，例如 OCLint.


xctool 相对于 xcodebuild 另一个主要的进步是，xctool 可以和 Xcode.app 一样执行应用测试（xcodebuild 不能区分项目 scheme 中哪些是测试使用的 target，更不用说在模拟器中执行测试了）。

仅仅因为这一个原因，xctool 就深刻地影响了 Objective-C 社区中新兴的持续集成测试的规范。

通过以下命令安装 `xctool`：

```
$ brew install xctool
```

### OCLint

OCLint 是一个静态代码分析工具，可以检查 Objective-C（也支持 C 和 C++）代码中常见的问题，例如空的 if/else/try/catch/finally 语句，未使用的本地变量和参数，大量复杂的没有注释的(NCSS)，具有圈复杂度或者 NPath 复杂度的代码，冗余的代码，代码“异味”，以及其他的不好的代码实践。

安装 OCLint 最好的方式是通过 Homebrew Cask:

```
$ brew cask install oclint
```

还记得 `xctool` 的 `json-compilation-database` 输出选项吗？它的输出可以直接 被 `OCLint` 读取，供它进行魔法一般的静态分析。

```
$ xctool -workspace NSHipster.xcworkspace -scheme "NSHipster" -reporter json-compilation-database build > compile_commands.json

$ oclint-json-compilation-database
```

### xcpretty

`xcpretty` 类似于 `xctool`，改进了 `xcodebuild` 的构建输出，但是 `xcpretty` 不是尝试替换 `xcodebuild`，而是扩展并改进它。

实际上，xcpretty 通过获取 xcodebuild 的管道输出而不是直接调用，充分体现了 Unix的可组合性理念：

```
$ xcodebuild [flags] | xcpretty -c
```

这种方法的一个主要好处是它真的很快——事实上，在某些情况下，xcpretty 实际上比直接调用 xcodebuild 快一点，因为它节省了打印到控制台的时间。

与 xctool 的另一个共性是报告器功能，其具有格式化输出到JUnit风格的XML、HTML或上述OCTool 兼容的 json编译数据库格式。

xcpretty 通过 RubyGems 安装：

```
$ gem install xcpretty
```

### Nomad

`Nomad` 是用于 iOS 和 OS X 开发的世界级命令行实用程序的集合。它自动化常见的管理任务，以便开发人员可以专注于构建和传输软件。

每个工具可以单独安装，也可以一起安装：

```
$ gem install nomad-cli
```

#### Cupertino

应用程序 Provisioning 流程普遍被苹果开发人员厌恶。

除了整个过程是一个从开始到完成的噩梦，许多操作需要通过 Web 界面进行交互。不仅需要大量的额外点击，但使得它非常不自动化。

`Cupertino` 提供一个命令行工具管理设备、provisioning proﬁle、app ID 和证书。

```
$ ios devices:list

+------------------------------+---------------------------------------+

|

Listing 2 devices. You can register 98 additional devices.

|

+---------------------------+------------------------------------------+

| Device Name

| Device Identifier

|

+---------------------------+------------------------------------------+

| Johnny Appleseed iPad

| 0123456789012345678901234567890123abcdef |

| Johnny Appleseed iPhone

| abcdef0123456789012345678901234567890123 |

+---------------------------+------------------------------------------+

$ ios devices:add "iPad 1"=abc123

$ ios devices:add "iPad 2"=def456 "iPad 3"=ghi789 ...
```

通过以下命令单独安装：

```
$ gem install cupertino
```

#### Shenzhen

Web 开发人员在 iOS 上的对应部分是能够在几秒钟内持续部署代码，而不是等待几天 Capertino 批准（有时拒绝！）更新。

幸运的是，一个围绕着开发和企业分发的新兴产业已经兴起。第三方服务像 HockeyApp、DeployGate 和 TestFlight 提供给开发者更容易的范式注册测试用户和发送最新构建给QA。

`Shenzhen` 是进一步自动化此过程的工具，通过构建 .ipa文件，然后发布到 FTP/SFTP服务器、S3 存储或者其他任何上述第三方服务。

```
$ cd /path/to/iOS Project/
$ ipa build
$ ipa distribute:sftp --host HOST -u USER -p PASSWORD -P FTP_PATH
```

#### Houston

`Houston` 是一个简单的工具发送苹果推送通知。传递凭据、构造消息并将其发送到设备。

```
$ apn push "<token>" -c /path/to/apple_push_notification.pem -m "Hello from the command line!"
```

这个工具对测试远程推送非常有用——尤其是在新应用中实现该功能。

#### Venice

不管怎样应用内购买已经成为app开发者最有利的商业模式。有了这么多，对某人的生活而言确保这些购买的有效性是首要的。

`Venice` 是一个命令行程序，用于验证 Apple 应用内购买收据，并检索与收据数据相关的信息。

```
$ iap verify /path/to/receipt
+-----------------------------+-------------------------------+

|

Receipt

|

+-----------------------------+-------------------------------+

| app_item_id

|

|

| bid

| com.foo.bar

|

| bvrs

| 20120427

|
| original_purchase_date

| Sun, 01 Jan 2013 12:00:00 GMT |

| original_transaction_id

| 1000000000000001

|

| product_id

| com.example.product

|

| purchase_date

| Sun, 01 Jan 2013 12:00:00 GMT |

| quantity

| 1

|

| transaction_id

| 1000000000000001

|

| version_external_identifier |

|

+-----------------------------+-------------------------------+
```

像 `Houston`、`Venice`有一个客户端库组件，允许它部署在 Rails或 Sinatra应用程序上。验证服务器上的收据允许保留他们自己的过去购买记录，这对于最新的指标和历史分析是有用的。因此，任何人关于IAP需要认真对待是推荐的做法。

#### Dubai

Passbook 管理登机牌、电影票、零售优惠券和会员卡。使用 PassKit API，开发人员可以注册 Web 服务自动更新 Passbook的内容，例如登机牌上的登机口更改或会员卡添加积分。

`Dubai`可以很容易地从脚本或命令行生成 .pkpass 文件，允许快速迭代你的 pass 的设计和内容，或者在空中生成一次性的。

```
$ pk generate Example.pass -T boarding-pass
```

一旦生成了通行证，它可以用 `Dubai` 创建本地 HTTP 服务，允许通行证在 iOS 模拟器中实时预览：

```
$ pk serve Example.pass -c /path/to/certificate.p12
$ open http://localhost:4567/pass.pkpass
```

### Fastlane

fastlane 是一套自动化打包的工具集，用 Ruby 写的，用于 iOS 和 Android 的自动化打包和发布等工具。gym 是其中的打包命令。

官网：<https://fastlane.tools>

GitHub：<https://github.com/fastlane/fastlane>

fastlane 包含了我们日常编码之后要上线时候进行操作的所有命令。

```
deliver: 上传屏幕截图、二进制程序数据和应用程序到AppStore
snapshot: 自动截取你的程序在每个设备上的图片
frameit: 应用截屏外添加设备框架
pem: 可以自动化地生成和更新应用推送通知描述文件
sigh: 生成下载开发商店的配置文件
produce: 利用命令行在 iTunes Connect 创建一个新的 iOS app
cert: 自动创建 iOS 证书
pilot: 最好的在终端管理测试和建立的文件
boarding: 很容易的方式邀请beta测试
gym: 建立新的发布的版本，打包
match: 使用git同步你成员间的开发者证书和文件配置
scan: 在iOS 和Mac app 上执行测试用例
```

一个完整的发布过程可以用 fastlane描述成下面这样：

```
lane :appstore do
	increment_build_number
	cocoapods
	xctool
	snapshot
	sigh
	deliver
	frameit
	sh "./customScript.sh"
	Slack
end
```

1. 提高版本号
2. cocoapods 进行相关pod配置
3. xctool 进行编译
4. snapshot 自动生成截图
5. sigh 处理 provision profile 相关的事情
6. deliver 上传截图
7. frameit 将应用截图快速的放入对应的设备尺寸中
8. 执行一些自动化的脚本
9. 把结果发送到 slack

这是一个完成的自动化的过程。不过实际发布过程中，截图那部分笔者所在公司还是自己手动上传了，fastlane基本还是用来自动化打包。

![intro-fastlane-tree](2017-03-07-intro-fastlane-tree.png)
安装fastlane

```
$ gem install fastlane
```

#### 初始化

在项目根目录下，初始化Fastlane:

```
$ fastlane init
```

初始化的过程中会要求填写一些项目信息比如 Apple ID, fastlane 会自动检测当前目录中项目的App Name和App Identifier。如果检测的不对，选择 n 自行输入。同时会在项目中生成一个fastlane的文件夹。

#### 目录结构

```
fastlane
├── Appfile
├── Deliverfile
├── Fastfile
├── metadata
│   ├── app_icon.jpg
│   ├── copyright.txt
│   ├── primary_category.txt
│   ├── primary_first_sub_category.txt
│   ├── primary_second_sub_category.txt
│   ├── review_information
│   │   ├── demo_password.txt
│   │   ├── demo_user.txt
│   │   ├── email_address.txt
│   │   ├── first_name.txt
│   │   ├── last_name.txt
│   │   ├── notes.txt
│   │   └── phone_number.txt
│   ├── secondary_category.txt
│   ├── secondary_first_sub_category.txt
│   ├── secondary_second_sub_category.txt
│   └── zh-Hans
│       ├── description.txt
│       ├── keywords.txt
│       ├── marketing_url.txt
│       ├── name.txt
│       ├── privacy_url.txt
│       ├── release_notes.txt
│       └── support_url.txt
└── screenshots
    ├── README.txt
    └── zh-Hans
        ├── 1_iphone6Plus_1.6+ Screenshot 0 iPhone.png
        ├── 2_iphone6Plus_2.6+ Screenshot 1 iPhone.png
        ├── 3_iphone6Plus_3.6+ Screenshot 4 iPhone.png
        ├── 4_iphone6Plus_4.6+ Screenshot 2 iPhone.png
        └── 5_iphone6Plus_5.6+ Screenshot 3 iPhone.png
```


上面这些文件中，最重要的两个文件就是Appfile和Fastfile。

Appfile 里面存放了App的基本信息包括app_identifier、apple_id、team_id。如果在init的时候你输入了正确的appId账号和密码会在这里生成正确的team_id信息。如果没有team，这里就不会显示。

Fastfile是最重要的一个文件，在这个文件里面可以编写和定制我们打包脚本的一个文件，所有自定义的功能都写在这里。

如果在init的时候选择了在iTunes Connect创建App，那么fastlane会调用produce进行初始化，如果现在还不想创建，也可以之后再运行produce init进行这个流程。如果不执行produce的流程，deliver的流程不会被执行，当然之后也可以deliver init运行完全一样的流程。

在iTunes Connect 中成功创建App之后，fastlane的文件夹里面就有Deliverfile文件了。

Deliverfile文件里面主要是deliver的配置文件和Deliverfile的一些帮助。








