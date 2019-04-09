title: 蓝牙通信
date: 2016-03-18 16:38:46
tags:
- Bluetooth
- BLE
- MultipeerConnectivity
- iBeacon
categories: iOS
---

# 蓝牙(Bluetooth)

去App Store搜索并下载**『LightBlue』**这个App，对调试你的app和理解Core Bluetooth会很有帮助。

## 蓝牙常见名称和缩写

- **MFI** —— make for ipad ,iphone, itouch 专门为苹果设备制作的设备
- **BLE** —— buletouch low energy，蓝牙4.0设备因为低耗电，所以也叫做BLE
- **peripheral,central** —— 外设和中心，发起连接的设备为central，被连接的设备为perilheral
- **service and characteristic** —— 服务和特征，每个设备会提供服务和特征，类似于服务端的api，但是机构不同。每个设备都会有一些服务，每个服务里面都会有一些特征，特征就是具体键值对，提供数据的地方。每个特征属性分为这么几种：读，写，通知三种方式。
- **Description** —— 每个characteristic可以对应一个或多个Description用户描述characteristic的信息或属性

MFI —— 开发使用ExternalAccessory 框架

4.0 BLE —— 开发使用CoreBluetooth 框架

<!--more-->

## Core Bluetooth概述

CoreBluetooth框架能够让你的iOS和Mac App能够和支持BLE的设备进行通信。比如，你的应用程序可以发现、搜索、以及和这些支持BLE的外围设备进行交互，比如心率监测器、数字温控器，甚至其他的iOS设备。

该框架基于BLE4.0规范，直接适用于蓝牙低功率设备的使用。是对于蓝牙 4.0规范的一个抽象，该框架隐藏了很多开发规范的底层实现细节，使您更容易开发出与蓝牙低功耗设备进行交互的App。因为该说明中涉及到蓝牙框架的一些概念和术语在本说明中已经被广泛采用，本文将向你介绍这个 Core Bluetooth 框架中的一些关键术语和概念。

## 中央（Central）和外围设备（Peripheral）以及它们之间蓝牙通信的规则

所有涉及蓝牙低功耗的交互中有两个主要的角色：中心`Central`和外围设备`Perpheral`。根据一些传统的`客户端-服务端`结构，`Peripheral`通常具有其他设备所需要的数据，而`Central`通常通过使用`Perpheral`的信息来实现一些特定的功能。如下图所示，例如，一个心率监听器可能含有一些有用的信息，你的 Mac/iOS app 可能需要以用户友好的方式显示用户的心率。

![](https://developer.apple.com/library/ios/documentation/NetworkingInternetWeb/Conceptual/CoreBluetooth_concepts/Art/CBDevices1_2x.png)

### Central 发现并连接广播中的 Peripheral

Peripheral向外广播一些广告包(Advertising)形式的数据，广告包是一个相对较小的、捆绑了外围可能包含的有用信息且必须提供的数据包，如外设的名称和主要功能。例如，一个数字温控器可能广播它能提供当前房间的温度。在低功耗蓝牙中，广播是Peripheral被获知的主要方式。
另一方面说，Central可以扫描和监听任何对广播内容感兴趣的Peripheral。如下图，Central可以请求连接任何已对外广播内容的Peripheral。

![](https://developer.apple.com/library/ios/documentation/NetworkingInternetWeb/Conceptual/CoreBluetooth_concepts/Art/AdvertisingAndDiscovery_2x.png)

### 数据在 Peripheral 中如何构成

连接到Peripheral的目的是为了对它所提供的数据进行探索和交互。在此之前，理解数据在Peripheral中是怎样构成的将会对我们有所帮助。  

Peripheral包含一个或者多个Service（服务）以及有关其连接信号强度的有用信息。Service是指为了实现一个功能或者特性的数据采集和相关行为的集合。例如，一个心率监听器的Service可能包含从监听心率传感器采集的心率数据。

Service本身由Characteristic（特征）或者包含其他被引用的Service组成。Characteristic提供了Peripheral的Service更多细节。例如，刚才描述的心率service中包含一个用来描述心率传感器位置信息的characteristic和另外一个发送测量心率数据的Characteristic（即这个服务包含了两个特征）。如下图阐述了一个心率监测器的服务和特征的数据可能的结构和特点。

![](https://developer.apple.com/library/ios/documentation/NetworkingInternetWeb/Conceptual/CoreBluetooth_concepts/Art/CBPeripheralData_Example_2x.png)

### Central 在 Peripheral 上的数据探索及交互

在Central成功与Peripheral建立连接后，就能发现到Peripheral提供的所有的Service和Characteristic。(广播数据可能只包含一部分可用的Service)
Central可以通过读写Service中Characteristic的value与Peripheral进行交互。例如，你的 App 也许会从数字温控器那里请求当前的室内温度，或者 App 向数字温控器提供一个值从而来设置当前房间的温度。

## Central、Peripherals及Peripheral数据的表示

在低功耗蓝牙通信中的主要角色(即前面提到的Central和Peripheral)及其数据通过简单、直接的方法映射到了CoreBluetooth框架中。

### Central 端的对象
当你使用本地Central和远程Peripheral进行交互(这里本地和远程的意思就是，比如你拿着手机搜索其他的设备，那么你的手机就是本地Central这端，其他的设备是远程Peripheral一端，这里的本地和远程是相对我们用户来说，表示空间距离，不是我们通常意义上的本地和远程，大家直接忽略本地和远程对理解也不会有什么影响)，在低功耗蓝牙通信中你通常扮演Central这端。除非你是建立一个本地Peripheral设备用来响应其他Central的请求，大多数的蓝牙交互由Central端完成。

#### 本地 Central 和远程 Peripheral
在Central端，本地Central设备用CBCentralManager对象表示。这些对象用来管理发现或连接远程Peripheral设备(表示为CBPeripheral)，包括扫描，发现和连接广播中的Peripheral。下图展示了在CoreBluetooth框架中本地 Central 和远程 Peripheral的对象表示。

![](https://developer.apple.com/library/ios/documentation/NetworkingInternetWeb/Conceptual/CoreBluetooth_concepts/Art/CBObjects_CentralSide_2x.png)

#### 远程 Peripheral 数据表示为 CBService 和CBCharacteristic

当你与远程Peripheral(表示为CBPeripheral)进行数据交互时，你将处理它的Service和Characteristic。在Core Bluetooth框架中，远程Peripheral的Service表示为CBService。相类似的，远程Peripheral中Service的Characteritic表示为CBCharacteristic。下图阐述了远程外围服务及特征的基础结构。

![](https://developer.apple.com/library/ios/documentation/NetworkingInternetWeb/Conceptual/CoreBluetooth_concepts/Art/TreeOfServicesAndCharacteristics_Remote_2x.png)

### Peripheral 端的对象
在OS X 10.9和iOS6以后，Mac和iOS设备可以设置成低功耗蓝牙的Peripheral，能够提供数据给其他的设备，包括其他的Macs，iPhones，iPads。当设置你的设备实现Peripheral角色时，你就可以完成低功耗蓝牙交互的Peripheral端功能。

#### 本地 Peripheral 和远程 Central
在Peripheral端，本地Peripheral设备用CBPeripheralManager对象来表示。这些对象用本地Peripheral设备的Service和Characteristic的数据库发布服务，广播给远程Central设备(表示为CBCentral)。CBPeripheralManager用时也用来响应远程Central的读写请求。下图展示了本地Peripheral和远程Central在CoreBluetooth框架中的表示。

![](https://developer.apple.com/library/ios/documentation/NetworkingInternetWeb/Conceptual/CoreBluetooth_concepts/Art/CBObjects_PeripheralSide_2x.png)

#### 本地 Peripheral 数据表示为 CBMutableService 和 CBMutableCharacteristic

当你建立和本地Peripheral(表示为CBPeripheralManager)数据交互，你其实是在处理Service和Characteristic的可变版本。就可以处理Service和Characteristic的可变版本。在Core Bluetooth框架中，本地Peripheral的Service表示为CBMutableService。相应的本地Peripheral中Service的Characteristic表示为CBMutableCharacteristic。下图阐述了本地外围服务和特征的基本结构。

![](https://developer.apple.com/library/ios/documentation/NetworkingInternetWeb/Conceptual/CoreBluetooth_concepts/Art/TreeOfServicesAndCharacteristics_Local_2x.png)

## 蓝牙开发流程
CoreBluetooth框架的核心其实是两个东西，peripheral和central, 可以理解成外设和中心。对应他们分别有一组相关的API和类。
![](/images/CoreBluetoothFramework.jpeg)
这两组api分别对应不同的业务场景，左侧叫做中心模式，就是以你的app作为中心，连接其他的外设的场景，而右侧称为外设模式，使用手机作为外设别其他中心设备操作的场景。
服务和特征，特征的属性(service and characteristic)：每个设备都会有一些服务，每个服务里面都会有一些特征，特征就是具体键值对，提供数据的地方。每个特征属性分为这么几种：读，写，通知这么几种方式。
```
//objcetive c特征的定义枚举
typedef NS_OPTIONS(NSUInteger, CBCharacteristicProperties) {
  CBCharacteristicPropertyBroadcast												= 0x01,
  CBCharacteristicPropertyRead													= 0x02,
  CBCharacteristicPropertyWriteWithoutResponse									= 0x04,
  CBCharacteristicPropertyWrite													= 0x08,
  CBCharacteristicPropertyNotify													= 0x10,
  CBCharacteristicPropertyIndicate												= 0x20,
  CBCharacteristicPropertyAuthenticatedSignedWrites								= 0x40,
  CBCharacteristicPropertyExtendedProperties										= 0x80,
  CBCharacteristicPropertyNotifyEncryptionRequired NS_ENUM_AVAILABLE(NA, 6_0)		= 0x100,
  CBCharacteristicPropertyIndicateEncryptionRequired NS_ENUM_AVAILABLE(NA, 6_0)	= 0x200
};
```

### 蓝牙中心模式流程

1. 建立中心角色
2. 扫描外设（discover）
3. 连接外设(connect)
4. 扫描外设中的服务和特征(discover)
    - 4.1 获取外设的services
    - 4.2 获取外设的Characteristics,获取Characteristics的值，获取Characteristics的Descriptor和Descriptor的值
5. 与外设做数据交互(explore and interact)
6. 订阅Characteristic的通知
7. 断开连接(disconnect)

### 蓝牙外设模式流程

1. 启动一个Peripheral管理对象
2. 本地Peripheral设置服务,特性,描述，权限等等
3. Peripheral发送广告
4. 设置处理订阅、取消订阅、读characteristic、写characteristic的委托方法

### 蓝牙设备状态
1. 待机状态（standby）：设备没有传输和发送数据，并且没有连接到任何设
2. 广播状态（Advertiser）：周期性广播状态
3. 扫描状态（Scanner）：主动寻找正在广播的设备
4. 发起链接状态（Initiator）：主动向扫描设备发起连接。
5. 主设备（Master）：作为主设备连接到其他设备。
6. 从设备（Slave）：作为从设备连接到其他设备。

### 蓝牙设备的五种工作状态
准备（standby）
广播（advertising）
监听扫描（Scanning
发起连接（Initiating）
已连接（Connected）

## 第三方库

<https://github.com/coolnameismy/BabyBluetooth>


## 参考资料

1. 官网文档：<https://developer.apple.com/library/ios/documentation/NetworkingInternetWeb/Conceptual/CoreBluetooth_concepts/CoreBluetoothOverview/CoreBluetoothOverview.html>
2. <http://lynchwong.com/2014/12/15/iOS蓝牙，CoreBluetooth框架简介及入门使用/>
3. <http://liuyanwei.jumppo.com/2015/07/17/ios-BLE-0.html>
4. <http://www.jianshu.com/p/760f042a1d81>
5. <http://southpeak.github.io/blog/2014/07/29/core-bluetoothkuang-jia-zhi-%5B%3F%5D-:centralyu-peripheral/>

# 多点通信（MultipeerConnectivity）

去App Store搜索并下载 **『FireChat』** 这个App，对理解`Multipeer Connectivity`框架会很有帮助。

## MultipeerConnectivity概述

那么Multipeer Connectivity框架到底能实现什么样的功能？即使在没有Wi-Fi和移动网络的情况下，利用Multipeer Connectivity框架，iOS设备之间也可以在一定范围内通过蓝牙和点对点的Wi-Fi连接进行通讯，这与利用Air Drop传输文件非常类似。

两台iOS设备在使用Multipeer Connectivity框架进行数据交换之前需要经过两个阶段——发现阶段和会话阶段。在发现阶段，使用Multipeer Connectivity框架的应用会浏览或通知周围可供连接的设备以便自己可以加入设备间的数据交换中。此时，两个应用之间是不能交换数据的。

当用户选择与某台设备连接在一起后，双方就进入了会话模式，这时它们将可以进行数据交互，比如，传送文字、图片等。

## 开发流程

用MultiPeerConnectivity进行通讯，如同三次握手的通讯类似，A先放出广播，B用于搜索！B搜到之后，会向A发送邀请，建立连接，当A接受了之后，A会向B发送一个会话(session)，若建立成功则可以互传数据！

### Advertising & Discovering

通信的第一步是让大家互相知道彼此，我们通过广播(Advertising)和发现(discovering)服务来实现。

广播作为服务器搜索附近的节点，而节点同时也去搜索附近的广播。在许多情况下，客户端同时广播并发现同一个服务，这将导致一些混乱，尤其是在client-server模式中。

每一个服务都应有一个类型（标示符），它是由ASCII字母、数字和“-”组成的短文本串，最多15个字符。通常，一个服务的名字应该由应用程序的名字开始，后边跟“-”和一个独特的描述符号。(作者认为这和 com.apple.* 标示符很像)，就像下边：

```
static NSString * const XXServiceType = @"xx-service";
```

一个节点有一个唯一标示MCPeerID对象，使用展示名称进行初始化，它可能是用户指定的昵称，或是单纯的设备名称。

```
MCPeerID *localPeerID = [[MCPeerID alloc] initWithDisplayName:[[UIDevice currentDevice] name]];
```

#### Creating a Session

创建session，并在接受邀请连接时传递到节点。

MCSession有两个初始化方式：

```
- (instancetype)initWithPeer:(MCPeerID *)myPeerID
- (instancetype)initWithPeer:(MCPeerID *)myPeerID securityIdentity:(NSArray *)identity encryptionPreference:(MCEncryptionPreference)encryptionPreference
```

myPeerID：本地节点标识符

securityIdentity：可选参数。通过X.509证书，它允许节点安全识别并连接其他节点。

encryptionPreference：指定是否加密节点之间的通信。MCEncryptionPreference枚举提供的三种值是:

```
MCEncryptionOptional:会话更喜欢使用加密,但会接受未加密的连接。
MCEncryptionRequired:会话需要加密。
MCEncryptionNone:会话不应该加密。
```

启用加密会显著降低传输速率，所以除非你的应用程序很特别，需要对用户敏感信息的处理，否则建议使用MCEncryptionNone。

```
MCSession *session = [[MCSession alloc] initWithPeer:localPeerID securityIdentity:nil encryptionPreference:MCEncryptionNone];
session.delegate = self;
```

MCSessionDelegate协议将会在发送和接受信息的部分被覆盖。

#### Advertising

##### MCNearbyServiceAdvertiser

服务的广播通过MCNearbyServiceAdvertiser来操作，初始化时带着本地节点、服务类型以及任何可与发现该服务的节点进行通信的可选信息。

```
MCNearbyServiceAdvertiser *advertiser = [[MCNearbyServiceAdvertiser alloc] initWithPeer:localPeerID discoveryInfo:nil serviceType:XXServiceType];
advertiser.delegate = self;
[advertiser startAdvertisingPeer];
```

相关事件由advertiser的代理来处理，需遵从MCNearbyServiceAdvertiserDelegate协议。

```
// 广播失败
- (void)advertiser:(MCNearbyServiceAdvertiser *)advertiser didNotStartAdvertisingPeer:(NSError *)error
// 是否接受或拒绝传入连接请求，并有权以拒绝或屏蔽任何来自该节点的后续请求选项
- (void)advertiser:(MCNearbyServiceAdvertiser *)advertiser didReceiveInvitationFromPeer:(MCPeerID *)peerID withContext:(NSData *)context invitationHandler:(void (^)(BOOL accept, MCSession *session))invitationHandler
```

##### MCAdvertiserAssistant

服务的广播通过MCAdvertiserAssistant来操作，初始化时带着服务类型以及Session信息。

```
MCAdvertiserAssistant *advertiser = [[MCAdvertiserAssistant alloc]initWithServiceType:XXServiceType discoveryInfo:nil session:session];
//开始广播
[advertiser start];
```

#### Discovering

客户端使用MCNearbyServiceBrowser来发现广播，它需要local peer标识符，以及非常类似MCNearbyServiceAdvertiser的服务类型来初始化：

```
MCNearbyServiceBrowser *browser = [[MCNearbyServiceBrowser alloc] initWithPeer:localPeerID serviceType:XXServiceType];
browser.delegate = self;
// 开始发现
[browser startBrowsingForPeers];
```

可能会有很多节点广播一个特定的服务，所以为了方便用户（或开发者），MCBrowserViewController将提供一个内置的、标准的方式来呈现链接到广播节点：

```
MCBrowserViewController *browserViewController =
    [[MCBrowserViewController alloc] initWithBrowser:browser
                                             session:session];
browserViewController.delegate = self;
[self presentViewController:browserViewController
                   animated:YES
                 completion:
^{
    // 开始发现
    [browser startBrowsingForPeers];
}];
```

当browser完成节点连接后，它将使用它的delegate调用browserViewControllerDidFinish:，以通知展示视图控制器--它应该更新UI以适应新连接的客户端。

```
#param mark - MCNearbyServiceBrowserDelegate
// 发现服务错误
- (void)browser:(MCNearbyServiceBrowser *)browser didNotStartBrowsingForPeers:(NSError *)error
// 发现附近的广播者
- (void)browser:(MCNearbyServiceBrowser *)browser foundPeer:(MCPeerID *)peerID withDiscoveryInfo:(NSDictionary<NSString *,NSString *> *)info
// 附近的广播者停止广播
- (void)browser:(MCNearbyServiceBrowser *)browser lostPeer:(MCPeerID *)peerID
```

```
#param mark - MCBrowserViewControllerDelegate
// 点击完成按钮
- (void)browserViewControllerDidFinish:(MCBrowserViewController *)browserViewController
// 点击取消按钮
- (void)browserViewControllerWasCancelled:(MCBrowserViewController *)browserViewController
```

### Sending & Receiving Information

一旦节点彼此相连，它们将能互传信息。Multipeer Connectivity框架区分三种不同形式的数据传输：

- Messages：定义明确的信息，比如端文本或者小序列化对象。
- Streams：可连续传输数据（如音频，视频或实时传感器事件）的信息公开渠道。
- Resources：是图片、电影以及文档的文件。

#### Messages

Messages使用-sendData:toPeers:withMode:error::方法发送。

```
NSString *message = @"Hello, World!";
NSData *data = [message dataUsingEncoding:NSUTF8StringEncoding];
NSError *error = nil;
if (![self.session sendData:data
                    toPeers:peers
                   withMode:MCSessionSendDataReliable
                      error:&error]) {
    NSLog(@"[Error] %@", error);
}
```

通过MCSessionDelegate方法 -sessionDidReceiveData:fromPeer:收取信息。以下是如何解码先前示例代码中发送的消息：

```
#pragma mark - MCSessionDelegate
- (void)session:(MCSession *)session
 didReceiveData:(NSData *)data
       fromPeer:(MCPeerID *)peerID
{
    NSString *message =
        [[NSString alloc] initWithData:data
                              encoding:NSUTF8StringEncoding];
    NSLog(@"%@", message);
}
```

另一种方法是发送NSKeyedArchiver编码的对象：

```
id <NSSecureCoding> object = // ...;
NSData *data = [NSKeyedArchiver archivedDataWithRootObject:object];
NSError *error = nil;
if (![self.session sendData:data
                    toPeers:peers
                   withMode:MCSessionSendDataReliable
                      error:&error]) {
    NSLog(@"[Error] %@", error);
}
#pragma mark - MCSessionDelegate

- (void)session:(MCSession *)session
 didReceiveData:(NSData *)data
       fromPeer:(MCPeerID *)peerID
{
    NSKeyedUnarchiver *unarchiver = [[NSKeyedUnarchiver alloc] initForReadingWithData:data];
    unarchiver.requiresSecureCoding = YES;
    id object = [unarchiver decodeObject];
    [unarchiver finishDecoding];
    NSLog(@"%@", object);
}
```

为了防范对象替换攻击,设置requiresSecureCoding为YES是很重要的，这样如果根对象类没有遵从\<NSSecureCoding\>，就会抛出一个异常。

#### Streams

Streams 使用 -startStreamWithName:toPeer:方法发送：

```
NSOutputStream *outputStream =
    [session startStreamWithName:name
                          toPeer:peer];
stream.delegate = self;
[stream scheduleInRunLoop:[NSRunLoop mainRunLoop]
                forMode:NSDefaultRunLoopMode];
[stream open];
// ...
```

Streams通过MCSessionDelegate的方法session:didReceiveStream:withName:fromPeer:来接收：

```
#pragma mark - MCSessionDelegate

- (void)session:(MCSession *)session
didReceiveStream:(NSInputStream *)stream
       withName:(NSString *)streamName
       fromPeer:(MCPeerID *)peerID
{
    stream.delegate = self;
    [stream scheduleInRunLoop:[NSRunLoop mainRunLoop]
                      forMode:NSDefaultRunLoopMode];
    [stream open];
}
```

输入和输出的streams必须安排好并打开，然后才能使用它们。一旦这样做，streams就可以被读出和写入。

#### Resources

Resources 发送使用 -sendResourceAtURL:withName:toPeer:withCompletionHandler::

```
NSURL *fileURL = [NSURL fileURLWithPath:@"path/to/resource"];
NSProgress *progress =
    [self.session sendResourceAtURL:fileURL
                           withName:[fileURL lastPathComponent]
                             toPeer:peer
                  withCompletionHandler:^(NSError *error)
{
    NSLog(@"[Error] %@", error);
}];
```

返回的NSProgress对象可以是通过KVO(Key-Value Observed)来监视文件传输的进度，并且它提供取消传输的方法：-cancel。

接收资源实现MCSessionDelegate两种方法：-session:didStartReceivingResourceWithName:fromPeer:withProgress: 和 -session:didFinishReceivingResourceWithName:fromPeer:atURL:withError:

```
#pragma mark - MCSessionDelegate

- (void)session:(MCSession *)session
didStartReceivingResourceWithName:(NSString *)resourceName
       fromPeer:(MCPeerID *)peerID
   withProgress:(NSProgress *)progress
{
    // ...
}

- (void)session:(MCSession *)session
didFinishReceivingResourceWithName:(NSString *)resourceName
       fromPeer:(MCPeerID *)peerID
          atURL:(NSURL *)localURL
      withError:(NSError *)error
{
    NSURL *destinationURL = [NSURL fileURLWithPath:@"/path/to/destination"];
    NSError *error = nil;
    if (![[NSFileManager defaultManager] moveItemAtURL:localURL
                                                 toURL:destinationURL
                                                 error:&error]) {
        NSLog(@"[Error] %@", error);
    }
}
```

再次说明，在传输期间NSProgress parameter in -session:didStartReceivingResourceWithName:fromPeer:withProgress:允许接收节点来监控文件传输进度。在-session:didFinishReceivingResourceWithName:fromPeer:atURL:withError:中,delegate的责任是从临时localURL移动文件至永久位置。

Multipeer是突破性的API，其价值才刚刚开始被理解。虽然完整的支持功能比如AirDrop目前仅限于最新的设备，你应该会看到它将成为让所有人盼望的功能。

## 参考资料

1. <http://www.cocoachina.com/industry/20140408/8118.html>
2. <https://www.objc.io/issues/18-games/multipeer-connectivity-for-games/>
3. <http://blog.csdn.net/daiyibo123/article/details/48287079>
4. <http://www.jianshu.com/p/84b479039797>
5. <http://www.jianshu.com/p/d1401793eeea>

# iBeacon

## iBeacon概述

维基百科定义

> iBeacon是apple公司提出的“一种可以让附近手持电子设备检测到的一种新的低功耗、低成本信号传送器”的一套可用于室内定位系统的协议。这种技术可以使一个智能手机或其他装置在一个iBeacon基站的感应范围内执行相应的命令。
>
> 这是帮助智能手机确定他们大概位置或环境的一个应用程序。在一个iBeacon基站的帮助下，智能手机的软件能大概找到它和这个iBeacon基站的相对位置。iBeacon能让手机收到附近售卖商品的通知，也可以让消费者不用拿出钱包或信用卡就能在销售点的POS机上完成支付。iBeacon技术通过低功耗蓝牙（BLE），也就是我们所说的智能蓝牙来实现。
>
> iBeacon为利用低功耗蓝牙可以近距离感测的功能来传输通用唯一识别码的一个app或操作系统。这个识别码可以在网上被查找到用以确定设备的物理位置或者可以在设备上触发一个动作比如在社交媒体签到或者推送通知。

iBeacon 是苹果公司在 iOS 7 中新推出的一种近场定位技术，可以感知一个附近的 iBeacon 信标的存在。
当一个 iBeacon 兼容设备进入/退出一个 iBeacon 信标标识的区域时，iOS 和支持 iBeacon 的 app 就能得知这一信息，从而对用户发出相应的通知。

典型的应用场景例如博物馆实时推送附近展品的相关信息，商场内即时通知客户折扣信息等。苹果在 Apple Store 中也部署了 iBeacon 来推送优惠、活动信息。

## 特点

iBeacon 基于低功耗蓝牙技术（Bluetooth Low Energy, BLE）这一开放标准，因此也继承了 BLE 的一些特点。

- 范围广

  相比于 NFC 的数厘米的识别范围，iBeacon 的识别范围可以达到数十米，并且能够估计距离的远近。



- 兼容性

  iBeacon 是基于 BLE 做的一个简单封装，因此大部分支持 BLE 的设备都可以兼容。例如可以使用一个普通的蓝牙芯片作为信标，使用 Android 设备检测信标的存在。



- 低能耗

  不少 beacon 实现宣称可以不依赖外部能源独立运行两年。

## 使用场景

我们以一个连锁商场的例子来讲解 iBeacon 的一个流程。在一个连锁商场中，店家需要在商场中的不同地方推送不同的优惠信息，比如服装和家居柜台推送的消息就很有可能不同。

当消费者走进某个商场时，会扫描到一个 beacon。这个 beacon 有三个标志符，proximityUUID 是一个整个公司（所有连锁商场）统一的值，可以用来标识这个公司，major 值用来标识特定的连锁商场，比如消费者正在走进的商场，minor 值标识了特定的一个位置的 beacon，例如定位到消费者正在门口。

这时商场的 app 会被系统唤醒，app 可以运行一个比较短的时间。在这段时间内，app 可以根据 beacon 的属性查询到用户的地理位置（通过查询服务器或者本地数据），例如在化妆品专柜，之后就可以通过一个 local notification 推送化妆品的促销信息。用户可以点击这次 local notification 来查看更详细的信息，这样一次促销行为就完成了。

## iBeacon使用

使用iBeacon需要添加2个库的支持，CoreLocation.framework、CoreBluetooth.framework

```
#import <CoreLocation/CoreLocation.h>
#import <CoreBluetooth/CoreBluetooth.h>
```

宏定义

```
#define UUID @"E2C56DB5-DFFB-48D2-B060-D0F5A71096E4"
#define IDENTIFIER [NSBundle mainBundle].bundleIdentifier
```

成员变量

```
//建立iBeacon服务端，只负责发送出去数据
CLBeaconRegion * serverBeaconRegion;
CBPeripheralManager * peripheralMsg;

//建立iBeacon客户端,只负责接收数据
CLLocationManager * locationManager;
CLBeaconRegion * findBeaconRegion;
//对于商场应用，我们多数可能只需要客户端，而不一定需要服务端

//我们还需要字典，记录发送端的返回数据
NSMutableDictionary * regionData;
```

### 使用 iOS 设备作为 iBeacon

```
// 服务端设置主频和副频 unsigned short最大数不超过65535
//主频(最有效值)
CLBeaconMajorValue major=1430;
//副频(最低有效值)
CLBeaconMinorValue minor= 1000;
//创建UUID
NSUUID * user = [[NSUUID alloc]initWithUUIDString:UUID];

//创建发现信息
serverBeaconRegion = [[CLBeaconRegion alloc]initWithProximityUUID:user major:major minor:minor identifier:IDENTIFIER];
//发现信息计算成字典
regionData = [serverBeaconRegion peripheralDataWithMeasuredPower:nil];

//创建服务
peripheralMsg = [[CBPeripheralManager alloc]initWithDelegate:self queue:dispatch_get_main_queue()];
```

```
#pragma mark - CBPeripheralManagerDelegate
-(void)peripheralManagerDidUpdateState:(CBPeripheralManager *)peripheral
{
    //检测状态
    if (peripheral.state==CBPeripheralManagerStatePoweredOn) {
        //可以开始
        [peripheral startAdvertising:regionData];
    }else{
        if (peripheral.state==CBPeripheralManagerStatePoweredOff) {
            //关闭
            [peripheral stopAdvertising];

        }
    }
}
```

### 使用 iOS 设备发现 iBeacon

不用设置主频和副频，需要设置UUID
```
NSUUID *user = [[NSUUID alloc]initWithUUIDString:UUID];
//注意这里初始化和服务端的初始化有所区别
findBeaconRegion = [[CLBeaconRegion alloc]initWithProximityUUID:user identifier:IDENTIFIER];
locationManager = [[CLLocationManager alloc]init];
locationManager.delegate=self;
// NSLocationAlwaysUsageDescription
// 请求用户定位权限
[locationManager requestAlwaysAuthorization];
//开启搜索
[locationManager startRangingBeaconsInRegion:findBeaconRegion];
[locationManager startMonitoringForRegion:findBeaconRegion];
[locationManager requestStateForRegion:findBeaconRegion];
```

```
#pragma mark - CLLocationManagerDelegate
// 用户定位授权回调
- (void)locationManager:(CLLocationManager *)manager didChangeAuthorizationStatus:(CLAuthorizationStatus)status
{
    if (status == kCLAuthorizationStatusAuthorizedAlways) {
        //开启iBeacon搜索
        [manager startRangingBeaconsInRegion:findBeaconRegion];
        [manager startMonitoringForRegion:findBeaconRegion];
        [manager requestStateForRegion:findBeaconRegion];
    }
}
// 近距离回调
-(void)locationManager:(CLLocationManager *)manager didDetermineState:(CLRegionState)state forRegion:(CLRegion *)region
{
    //近距离回调，有三个状态，三个状态分别在我们距离1米以内的时候触发
    if (state==CLRegionStateInside) {
        //在1米以内
    }else{
        if (state==CLRegionStateOutside) {
            //在1米以外
        }else{
            //不知道CLRegionStateUnknown;

        }
    }
}
-(void)locationManager:(CLLocationManager *)manager didEnterRegion:(CLRegion *)region
{
    //该方法在推出后台，并且锁屏情况下依然可以触发，我们可以设置当我们进入后台时候，设置本地推送来提示用户进入一个范围即可
    //判断是否在后台
    UIApplicationState back=[UIApplication sharedApplication].applicationState;
    if (back==UIApplicationStateBackground) {
        //在后台，我们需要执行推送告知用户
        UILocalNotification*local=[[UILocalNotification alloc]init];
        //设置时间
        local.fireDate=[NSDate date];
        //设置文字
        local.alertBody=@"我们进入一个店铺";
        //加入推送
        [[UIApplication sharedApplication]scheduleLocalNotification:local];


    }

    NSLog(@"进入了一个iBeacon，欢迎光临");

}
-(void)locationManager:(CLLocationManager *)manager didExitRegion:(CLRegion *)region
{
    NSLog(@"离开了一个iBeacon，欢迎再次光临");
}
-(void)locationManager:(CLLocationManager *)manager didRangeBeacons:(NSArray *)beacons inRegion:(CLBeaconRegion *)region
{
    //扫描结果
    NSLog(@"扫描结果，该函数会一直调用");

    for (int i=0; i<beacons.count; i++) {
        //读取灯塔
        CLBeacon*beacon=beacons[i];
        //其中的数据转换为字符串
        NSString*message= [self beaconValue:beacon];

        NSLog(@"beacon~~~%@",message);

        //设置复用过程
        UITextView*textView=(UITextView*)[self.view viewWithTag:beacon.minor.integerValue];
        if (textView) {
            textView.text=message;
        }else{
            //创建

            textView=[[UITextView alloc]initWithFrame:CGRectMake(num%3*110, num/3*200+64, 100, 190)];
            textView.backgroundColor=[UIColor blackColor];
            textView.textColor=[UIColor whiteColor];
            //复用的关键
            textView.tag=beacon.minor.integerValue;
            [self.view addSubview:textView];
            //设置num+1
            num=num+1;
            textView.text=message;

        }

    }




}
-(NSString*)beaconValue:(CLBeacon*)beacon{
    //获取主频和副频
    NSString*major=beacon.major.stringValue;
    NSString*minor=beacon.minor.stringValue;
    //获取距离
    NSString*acc=[NSString stringWithFormat:@"%lf",beacon.accuracy];
    //获取感知，当距离非常近的时候告诉我接近程度 proximity是一个枚举
    NSString*px=[NSString stringWithFormat:@"%ld",beacon.proximity];
    //信号强度
    NSString*rssi=[NSString stringWithFormat:@"%ld",beacon.rssi];

    //组装字符串
    NSString*message=[NSString stringWithFormat:@"主频~%@\n副频~%@\n距离~%@\n感知~%@\n信号强度~%@\n",major,minor,acc,px,rssi];

    return message;
}
-(void)locationManager:(CLLocationManager *)manager rangingBeaconsDidFailForRegion:(CLBeaconRegion *)region withError:(NSError *)error
{
    NSLog(@"扫描失败");
    //当扫描启动失败以后，也就是用户没有开启蓝牙导致的失败，我们需要提示用户如何打开iBeacon，这个过程其实是诱导用户打开，判断是否在后台如果在后台就不进行任何操作了
    //该功能在iOS7下的各个版本表现不一样，iOS7.0时候启动失败，就算打开蓝牙开关也无效，只能通过重启手机办法才可以做到，iOS7.1.2的时候，苹果明确说明了特意修复了该功能，但是实际表现结果依然差劲，还是需要重启解决，但是这个说明在上线时候，苹果对审核的时候，也表示可以理解，并在会发一封致歉信给苹果开发者
}
```



## 参考资料

1. <https://zh.wikipedia.org/wiki/IBeacon>
2. <https://developer.apple.com/ibeacon/>
3. <https://github.com/nixzhu/dev-blog/blob/master/2014-04-23-ios7-ibeacons-tutorial.md>
4. <http://tech.meituan.com/iBeacaon-first-glance.html>
5. <http://www.jianshu.com/p/7816b016ceac>

# Demo 下载
<https://github.com/chaoskyme/Demo/tree/master/Bluetooth>
