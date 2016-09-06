title: iOS 硬件（二维码扫描、传感器、3D-Touch、蓝牙）
date: 2016-02-18 11:11:12
tags:
- QRCode
- Sensor
- 3D Touch
categories: iOS
---
## 二维码扫描识别

iOS中实现二维码和条形码扫描，两大开源组件 ZBarSDK 与 ZXing以及AVFoundation。AVFoundation.framework（iOS 7 ）之后才添加了二维码扫描的功能。

### Demo下载：[QRCodeScanner](https://github.com/chaoskyme/Demo/tree/master/QRCodeScanner)

<!--more-->
## 传感器

### 距离传感器（Proximity Sensor）

用于检测是否有其他物体靠近设备屏幕

```
// 开启距离感应功能
[UIDevice currentDevice].proximityMonitoringEnabled = YES;
// 监听距离感应的通知
[[NSNotificationCenter defaultCenter] addObserver:self
selector:@selector(proximityChange:)
name:UIDeviceProximityStateDidChangeNotification
object:nil];

- (void)proximityChange:(NSNotification *)notification {
    if ([UIDevice currentDevice].proximityState == YES) {
    NSLog(@"某个物体靠近了设备屏幕"); // 屏幕会自动锁住
    } else {
    NSLog(@"某个物体远离了设备屏幕"); // 屏幕会自动解锁
    }
}
```

### 磁力计传感器（Magnetometer Sensor）

可以感应地球磁场， 获得方向信息， 使位置服务数据更精准。

可以用于电子罗盘和导航应用。

```
调用CLLocationManager的startUpdatingHeading方法获取方向信息。获取方向结束时，可调用stopUpdatingHeading方法结束获取方向信息。

当设备的方向改变时，iOS系统将会自动激发CLLocationManager的delegate对象的locationManager:didUpdateHeading:方法，而程序可通过重写该方法来获取设备方向。
```

### 环境光传感器（Ambient Light Sensor）

是iPhone和Mac设备中最为古老的传感器成员

它能够让你在使用 Mac、iPhone、iPad时，眼睛更为舒适。

从一个明亮的室外走入相对黑暗的室内后，iOS设备会自动调低亮度，让屏幕显得不再那么光亮刺眼。

当你使用iPhone拍照时，闪光灯会在一定条件下自动开启

几乎所有的Mac 都带有背光键盘，当周围光线弱到一定条件时，会自动开启键盘背光

```
// 获取当前环境下屏幕亮度
NSLog(@"Screen Brightness: %f",[UIScreen mainScreen].brightness);
// 可以监听屏幕亮度改变的通知 UIScreenBrightnessDidChangeNotification
```

## CoreMotion

CoreMotion是一个专门处理Motion的框架，其中包含了两个部分加速度计和陀螺仪。加速计由三个坐标轴决定，用户最常见的操作设备的动作移动，晃动手机(摇一摇)，倾斜手机都可以被设备检测到，加速计可以检测到线性的变化，陀螺仪可以更好的检测到偏转的动作，可以根据用户的动作做出相应的动作，iOS模拟器无法模拟以上动作，真机调试需要开发者账号。

处理Motion事件有三种方式，开始(motionBegan)，结束(motionEnded)，取消(motionCancelled)：

```
- (void)motionBegan:(UIEventSubtype)motion withEvent:(UIEvent *)event NS_AVAILABLE_IOS(3_0);
- (void)motionEnded:(UIEventSubtype)motion withEvent:(UIEvent *)event NS_AVAILABLE_IOS(3_0);
- (void)motionCancelled:(UIEventSubtype)motion withEvent:(UIEvent *)event NS_AVAILABLE_IOS(3_0);
```

CMMotionManager类能够使用到设备的所有移动数据(motion data)，Core Motion框架提供了两种对motion数据的操作方式：

pull方式：能够以CoreMotionManager的只读方式获取当前任何传感器状态或是组合数据，在有需要的时候，再主动去采集数据；

push方式：是以块或者闭包的形式收集到想要得到的数据并且在特定周期内得到实时的更新，实时采集所有数据（采集频率高)；

### 加速计传感器（Motion/Accelerometer Sensor）

加速计用于检测设备在X、Y、Z轴上的加速度 （哪个方向有力的作用）

加速计可以用于检测设备的摇晃，经典应用场景

摇一摇、计步器

![](http://7xooko.com1.z0.glb.clouddn.com/070034106495370.png)

如果只需要知道设备的方向，不需要知道具体方向矢量角度，那么可以使用UIDevice进行操作，还可以根据方向就行判断,具体可以参考一下苹果官网代码:

```
-(void) viewDidLoad {
     // Request to turn on accelerometer and begin receiving accelerometer events
     [[UIDevice currentDevice] beginGeneratingDeviceOrientationNotifications];
     [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(orientationChanged:) name:UIDeviceOrientationDidChangeNotification object:nil];
}

- (void)orientationChanged:(NSNotification *)notification {
     // Respond to changes in device orientation
}

-(void) viewDidDisappear {
     // Request to stop receiving accelerometer events and turn off accelerometer
     [[NSNotificationCenter defaultCenter] removeObserver:self];
     [[UIDevice currentDevice] endGeneratingDeviceOrientationNotifications];
}

- (BOOL)canBecomeFirstResponder {
    return YES;
}

- (void)viewDidAppear:(BOOL)animated {
    [self becomeFirstResponder];
}
```

Push 方式：

```
// 创建运动管理者对象
_motionMgr = [[CMMotionManager alloc] init];

// 判断加速计是否可用（最好判断）
if (_motionMgr.isAccelerometerAvailable) {
    // 加速计可用
    // 设置采样间隔
    _motionMgr.accelerometerUpdateInterval = 1.0/30.0; // 1秒钟采样30次

    // 开始采样（采样到数据就会调用handler，handler会在queue中执行）
    [_motionMgr startAccelerometerUpdatesToQueue:[[NSOperationQueue alloc] init] withHandler:^(CMAccelerometerData * accelerometerData, NSError * error) {
        CMAcceleration acceleration = accelerometerData.acceleration;
        NSLog(@"CMAcceleration: %f--%f--%f", acceleration.x, acceleration.y, acceleration.z);
    }];
}
else {
    // 加速度计不能用
    NSLog(@"加速度计不能用");
}
```

Pull 方式：

```
// 创建运动管理者对象
_motionManager = [[CMMotionManager alloc] init];

// 判断加速计是否可用（最好判断）
if (_motionManager.isAccelerometerAvailable) {
    // 加速计可用

    // 设置加速计采样频率
    _motionManager.accelerometerUpdateInterval = 1.0/30.0; // 1秒钟采样30次
    // 开始采样
    [_motionManager startAccelerometerUpdates];
}

// 在需要的时候采集加速度数据
CMAcceleration acceleration = _motionManager.accelerometerData.acceleration;
NSLog(@"%f, %f, %f", acceleration.x, acceleration.y, acceleration.z);
```

### 陀螺仪（Gyroscope）

陀螺仪的原理是检测设备在X、Y、Z轴上所旋转的角速度

陀螺仪在赛车类游戏中有重大作用：

模拟汽车驾驶时方向盘旋转的动作，使得这类游戏的操控体验更为真实

![](http://7xooko.com1.z0.glb.clouddn.com/070035576334022.png)

Push 方式：

```
// 创建运动管理者对象
if (!_motionManager) {
    _motionManager = [[CMMotionManager alloc] init];
}
// 判断陀螺仪是否可用
if (_motionManager.gyroAvailable) {
    // 设置采样频率
    _motionManager.gyroUpdateInterval = 1 / 10.0; // 1秒钟采样10次
    // 开始采样
    [_motionManager startGyroUpdatesToQueue:[[NSOperationQueue alloc] init] withHandler:^(CMGyroData * gyroData, NSError * error) {
        // 获取陀螺仪的信息
        CMRotationRate rotationRate = gyroData.rotationRate;
        NSLog(@"x:%f y:%f z:%f", rotationRate.x, rotationRate.y, rotationRate.z);
    }];
}
else {
    // 陀螺仪不能用
    NSLog(@"陀螺仪不能用");
}
```

Pull 方式：

```
// 创建运动管理者对象
if (!_motionManager) {
    _motionManager = [[CMMotionManager alloc] init];
}
// 判断陀螺仪是否可用
if (_motionManager.gyroAvailable) {
    // 设置采样频率
    _motionManager.gyroUpdateInterval = 1 / 10.0; // 1秒钟采样10次
    // 开始采样
    [_motionManager startGyroUpdates];
}
else {
    // 陀螺仪不能用
    NSLog(@"陀螺仪不能用");
}

// 在需要的时候采集加速度数据
CMRotationRate rotationRate = _motionManager.gyroData.rotationRate;
NSLog(@"x:%f y:%f z:%f", rotationRate.x, rotationRate.y, rotationRate.z);
```

### 计步器（CMStepCounter）

```
// 判断当前系统版本，iOS 8 之后CMStepCounter废弃了
if ([[UIDevice currentDevice].systemVersion floatValue] < 8.0)
{
    // 1.判断计步器是否可用
    if (![CMStepCounter isStepCountingAvailable]) {
        NSLog(@"计步器不可用");
        return;
    }

    // 创建计步器
    if (!_stepCounter) {
        _stepCounter = [[CMStepCounter alloc] init];
    }

    // 开始计步
    // updateOn : 用户走了多少步之后, 更新block
    NSOperationQueue *queue = [[NSOperationQueue alloc] init];
    [_stepCounter startStepCountingUpdatesToQueue:queue updateOn:5 withHandler:^(NSInteger numberOfSteps, NSDate * timestamp, NSError * error) {
        if (error) {
            NSLog(@"%@", error);
            return;
        }
        NSLog(@"一共走了%ld步", numberOfSteps);
    }];
}
else {
    // 判断计步器是否可用
    if (![CMPedometer isStepCountingAvailable]) {
        return;
    }

    // 创建计步器
    if (!_pedometer) {
        _pedometer = [[CMPedometer alloc] init];
    }

    // 开始计步
    // FromDate : 从什么时间开始计步
    NSDate *date = [NSDate date];
    [_pedometer startPedometerUpdatesFromDate:date withHandler:^(CMPedometerData * pedometerData, NSError * error) {
        if (error) {
            NSLog(@"%@", error);
            return;
        }
        NSLog(@"您一共走了%@步", pedometerData.numberOfSteps);
    }];

    // 计算两个时间间隔走了多少步
    NSDateFormatter *fmt = [[NSDateFormatter alloc] init];
    fmt.dateFormat = @"yyyy-MM-dd";
    NSDate *fromDate = [fmt dateFromString:@"2015-9-26"];
    NSDate *toDate = [fmt dateFromString:@"2016-1-28"];
    [_pedometer queryPedometerDataFromDate:fromDate toDate:toDate withHandler:^(CMPedometerData * pedometerData, NSError * error) {

        NSLog(@"从%@到%@期间，总共走了%@步，总长%@米，上楼%@层，下楼%@层", pedometerData.startDate, pedometerData.endDate, pedometerData.numberOfSteps, pedometerData.distance, pedometerData.floorsAscended, pedometerData.floorsDescended);
    }];
}
```

### Demo 下载：[SensorDemo](https://github.com/chaoskyme/Demo/tree/master/SensorDemo)

## 3D Touch

3D Touch 仅支持iPhone 6S/ 6S Plus，支持的iOS 系统版本为iOS 9。

使用3D Touch功能，主要分为以下三个模块：Home Screen Quick Actions、Peek and Pop、UITouch Force Properties。

### Home Screen Quick Actions

通过主屏幕的应用Icon，我们可以用3D Touch呼出一个菜单，进行快速定位应用功能模块相关功能的开发。

![](http://7xooko.com1.z0.glb.clouddn.com/Snip20160128_1.png)

iOS9为我们提供了两种屏幕标签，分别是静态标签和动态标签。

#### 静态标签

静态标签是我们在项目的配置plist文件中配置的标签，在用户安装程序后就可以使用，并且排序会在动态标签的前面。

在info.plist文件中添加如下键值（系统没有提示，只能手动输入）：

![](http://7xooko.com1.z0.glb.clouddn.com/171313_aywB_2340880.png)

显示效果

![](http://7xooko.com1.z0.glb.clouddn.com/172431_lbhm_2340880.png)

添加步骤：

1. 先添加了一个UIApplicationShortcutItems的数组

2. 数组中添加的元素就是对应的静态标签，在每个标签中我们需要添加一些设置的键值：

   必填项：

   `UIApplicationShortcutItemType` 这个键值设置一个快捷通道类型的字符串

   `UIApplicationShortcutItemTitle` 这个键值设置标签的标题

   选填项：

   `UIApplicationShortcutItemSubtitle` 设置标签的副标题

   `UIApplicationShortcutItemIconType` 设置标签Icon类型

   `UIApplicationShortcutItemIconFile`  设置标签的Icon文件

   `UIApplicationShortcutItemUserInfo` 设置信息字典(用于传值)

#### 动态标签

动态标签是我们在程序中，通过代码添加的。

与之相关的类，主要有三个：

`UIApplicationShortcutItem` 创建3DTouch标签的类

`UIMutableApplicationShortcutItem` 创建可变的3DTouch标签的类

`UIApplicationShortcutIcon` 创建标签中图片Icon的类

```
//创建
UIApplicationShortcutItem * item = [[UIApplicationShortcutItem alloc]initWithType:@"two" localizedTitle:@"第二个标签" localizedSubtitle:@"看我哦" icon:[UIApplicationShortcutIcon iconWithType:UIApplicationShortcutIconTypePlay] userInfo:nil];
// 添加
[UIApplication sharedApplication].shortcutItems = @[item];
```

#### 响应标签的行为

当我们点击标签进入应用程序时，有这样一个方法可以进行一些操作：

`- (void)application:(UIApplication *)application performActionForShortcutItem:(UIApplicationShortcutItem *)shortcutItem completionHandler:(void (^)(BOOL))completionHandler`

当我们通过标签进入app时，就会在`AppDelegate`中调用这样一个回调，我们可以获取shortcutItem的信息进行相关逻辑操作。

这里有一点需要注意：

我们在app的入口函数：

`- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions`

也需要进行一下判断，在launchOptions中有UIApplicationLaunchOptionsShortcutItemKey这样一个键，通过它，我们可以区别是否是从标签进入的app，如果是则处理结束逻辑后，返回NO，防止处理逻辑被反复回调。

#### 几点注意：

1. 快捷标签最多可以创建四个，包括静态的和动态的。
2. 每个标签的题目和icon最多两行，多出的会用...省略

### Peek and Pop

peek (预览)和 pop (详阅)。

现在你可以授权应用的视图控制器来响应用户不同的按压力量。随着用户按压力量的增加，交互会出现三个阶段:

#### 1.暗示内容预览是可使用的

轻按后，周围内容会变得模糊，这告诉用户预览更多内容( peek )是可以使用的。

![](http://cc.cocimg.com/api/uploads/20151021/1445415797442101.png)

#### 2.展示预览(peek)，和快捷选项菜单（peek quick actions）

轻按，屏幕视图就会过渡到 peek，一个你设置的用来展示更多内容的视图－就像Mail app做的一样。如果用户这时结束了触碰，peek就会消失并且应用回到交互开始之前的状态。

或者这个时候，用户可以在peek界面上更用力按下来跳转到使用peek呈现的视图,这个过渡动画会使用系统提供的pop过渡。pop出来的视图会填满你应用的根视图并显示一个返航按钮可以回到交互开始的地方。(图中没有显示最后展示pop视图的阶段)

![](http://cc.cocimg.com/api/uploads/20151021/1445416998255315.png)

**Peek快速选项**

如果用户一直保持触摸，可以向上滑动Peek视图，系统会展示出你预先设置和peek关联的peek快速选项。

每一项peek快速选项都是你应用中的深度链接。当peek快速选项出现后，用户可以停止触摸而且peek会停留在屏幕中。用户可点击一个快速选项，唤出相关链接。

![](http://cc.cocimg.com/api/uploads/20151021/1445417062907362.png)

#### 3.可选的跳转到预览中的视图(pop)

当你使用 peek 和 pop 时,系统通过压力决定从哪个阶段过度至下一个。用户可以在设置>通用>辅助功能>3D Touch中进行修改。

### UITouch Force Properties

In iOS 9, the UITouch class has two new properties to support custom implementation of 3D Touch in your app: **force** and **maximumPossibleForce**. For the first time on iOS devices, these properties let you detect and respond to touch pressure in the UIEvent objects your app receives.

The force of a touch has a high dynamic range, available as a floating point value to your app.

### 参考文章

1. 官方文档：<https://developer.apple.com/ios/3d-touch/>
2. <http://my.oschina.net/u/2340880/blog/511509>
3. <http://www.cocoachina.com/ios/20151028/13849.html>

### Demo 下载：[3D-Touch](https://github.com/chaoskyme/Demo/tree/master/3D-Touch)

## 蓝牙（BlueTooth）

参考PO主另外一篇文章：<http://chaosky.me/2016/03/18/Bluetooth-Communication/>


