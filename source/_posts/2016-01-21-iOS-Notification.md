title: iOS 推送通知
date: 2016-01-21 21:07:11
tags:
- 推送通知
- 远程推送
- 本地推送
categories: iOS
---

推送通知是当程序没有启动或不在前台运行时，告诉用户有新消息的一种途径。

有远程推送和本地推送之分。

<!--more-->

## 本地推送

本地推送就是由应用程序发起的推送通知，不经过服务器。

### 应用场景

一般用于不需要网络的提醒类情况

- 事件提醒类：到了我们自定义的时间，就会弹出一些信息告诉我们该干什么了，例如闹钟
- 游戏类：每日任务提醒，一到八点双倍经验时刻开启，就准时提醒用户登陆
- 书籍类：你有多少天没有看书了，需要学习哦
- 健康类：亲~你好多天没吃药了，不要放弃治疗
- 恶搞类：在你分手女朋友手机里安装一个软件，3个月后，自动开启xxx约你开房
- 硬件类：蓝牙连接，当程序在后台时候与蓝牙断开，需要有一个提示告诉用户蓝牙连接断开
- 记账类软件，会提醒我们的一些花销等等，比如超出额度。

### 实现代码

#### 创建本地推送通知

```
//ios8本地推送通知，添加一个授权方法
if ([UIApplication instancesRespondToSelector:@selector(registerUserNotificationSettings:)]){
        [[UIApplication sharedApplication] registerUserNotificationSettings:[UIUserNotificationSettings settingsForTypes:UIUserNotificationTypeAlert|UIUserNotificationTypeBadge|UIUserNotificationTypeSound categories:nil]];
    }

    UILocalNotification *localNotification = [[UILocalNotification alloc] init];//初始化本地通知
    if (localNotification != nil) {
        NSDate *now = [NSDate new];
        localNotification.fireDate = [now dateByAddingTimeInterval:15];//15秒后通知
        localNotification.repeatInterval = NSCalendarUnitMinute;//循环次数，NSCalendarUnitMinute一分一次
        localNotification.timeZone = [NSTimeZone defaultTimeZone];//UILocalNotification激发时间是否根据时区改变而改变
        localNotification.applicationIconBadgeNumber += 1;//应用的红色数字
        localNotification.soundName = UILocalNotificationDefaultSoundName;//声音，可以换成自己的，如：alarm.soundName = @"myMusic.caf"，自定义的声音文件播放时长必须在 30 秒以内。如果一个自定义的声音文件播放 超过 30 秒的限制，那将会被系统的声音替换
        localNotification.alertBody = @"我是通知内容";//提示信息 弹出提示框
        localNotification.alertAction = @"打开";//解锁按钮文字，就是在锁屏情况下有一个‘滑动来XXX’,这儿的XXX就是这里所设置的alertAction。如果不设置就是@“查看”
        localNotification.hasAction = YES;//是否显示额外的按钮，为no时alertAction的设置不起作用，hasAction默认是YES
        //通知的额外信息，不会展示出来，是用来判断通知是哪一条的额外信息
        NSDictionary *infoDict = [NSDictionary dictionaryWithObject:@"xiaofei" forKey:@"birthday"];
        localNotification.userInfo = infoDict;//添加额外的信息
        [[UIApplication sharedApplication] scheduleLocalNotification:localNotification];//添加本地通知到推送队列中
    }
```

注意：

本地推送通知加入以后，程序被杀掉，推送通知依然可以运行

当程序在前台时候我的推送通知虽然不会显示，但是依然会运行

如果要弹出推送通知，需要你程序退出后台才可以显示，快捷键command+shift+h

#### 接收本地推送通知

```
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
    //处理收到的通知...
    application.applicationIconBadgeNumber = 0;//应用程序角标清零
}
```

#### 取消本地推送通知

- ##### 取消指定通知

```
UIApplication *app = [UIApplication sharedApplication];
    NSArray* localNotifications = [app scheduledLocalNotifications];//获取当前应用所有的通知
    if (localNotifications) {
      // 遍历通知，找到对应的通知
        for (UILocalNotification* notification in localNotifications) {
            NSDictionary *dic = notification.userInfo;
            if (dic) {
                NSString* key = [dic objectForKey:@"key"];
                if ([key isEqualToString:@"name"]) {
                    //取消推送 （指定一个取消）
                    [app cancelLocalNotification:notification];
                    break;
                }
            }
        }
    }
```

- ##### 取消当前应用所有的推送

```
UIApplication *app = [UIApplication sharedApplication];
[app cancelAllLocalNotifications];
```



## 远程推送通知

远程推送通知是由服务器发送的消息经过苹果的APNS（Apple Push Notification Service）服务远程推送给设备。由于iOS操作系统限制，我们APP在后台不能做操作，也不能接收任何数据，所以需要用推送来接收消息。

**注意：**

**1. 模拟器无法接收远程推送消息，只有真机可以**

**2. 远程推送通知只能拥有付费的开发者账号才能创建**

### 应用场景

- 聊天消息推送
- 新闻推送
- 影视剧推送
- 小说更新推送
- 游戏活动推送
- 健康天气推送
- 提醒业务：比如一些秀场应用，女主播上线了，可以发送通知给所有关注她的土豪们，来赶紧撒钱

### 远程推送原理

![](http://7xooko.com1.z0.glb.clouddn.com/Push-Overview.jpg)

1. 注册：为应用程序申请消息推送服务。此时你的设备会向APNs服务器发送注册请求。
2. APNs服务器接收请求，并将deviceToken返给你设备上的应用程序
3. 客户端应用程序将deviceToken发送给后台服务器程序，后台接收并储存
4. 后台服务器向APNs服务器发送推送消息
5. APNs服务器将消息发给deviceToken对应设备上的应用程序

### 远程推送具体步骤

应用程序的App ID添加Push Notifications服务—>配置对应的证书—>配置对应Provisioning Profiles文件—>获取Device Token—>服务器端通过deviceToken和APNS建立SSL连接—>服务器端给APNS服务器发送推送消息

1. 创建App ID添加Push Notifications服务

   请参考[教你一步一步获取App ID](http://www.jianshu.com/p/074bc6fffd0e)

2. 配置Push Notifications服务和相应证书，配置文件Provisioning Profiles文件

   参考：[教你一步一步获取Provisioning Profiles](http://www.jianshu.com/p/6aa72b177daf)

3. 获取deviceToken，需要在代码中实现

   1. 注册远程推送通知

      ```
      if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 8.0) {
        UIUserNotificationType myTypes = UIRemoteNotificationTypeBadge | UIRemoteNotificationTypeAlert | UIRemoteNotificationTypeSound;
        UIUserNotificationSettings *settings = [UIUserNotificationSettings settingsForTypes:myTypes categories:nil];
        [[UIApplication sharedApplication] registerUserNotificationSettings:settings];
        [[UIApplication sharedApplication] registerForRemoteNotifications];
      }
      else{
        UIRemoteNotificationType myTypes = UIRemoteNotificationTypeBadge|UIRemoteNotificationTypeAlert|UIRemoteNotificationTypeSound;
        [[UIApplication sharedApplication] registerForRemoteNotificationTypes:myTypes];
      }
      ```

   2. 注册远程通知成功回调，获取deviceToken

      ```
      - (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken{
        NSLog(@"deviceToken:%@",deviceToken);
      }
      ```

   3. 注册远程通知失败回调

      ```
      - (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error{
        NSLog(@"注册失败，错误是：%@",error);
      }
      ```

4. 想要收到推送消息，就必须要有后台服务器向APNs服务器发请求。

   1、公司自己开发后台服务器程序

   2、采用第三方的后台服务程序，比如：百度云推送

5. 程序正在使用或者退出的状态下，收到远程推送通知回调

```
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo{
	//处理通知...
    NSLog(@"Receive remote notification : %@",userInfo);
    application.applicationIconBadgeNumber = 0;
}
```

### 集成第三方推送服务

#### 第三方推送

- 极光推送
- 蝴蝶推送
- 个推
- 信鸽推送
- 百度云推送
- 友盟推送

### 集成极光推送

#### 极光推送基本信息

**极光推送网站**：<https://www.jpush.cn>

#### 配置JPush的环境

参考官方极光推送文档或者下载的SDK：

[JPush iOS集成指南](http://docs.jpush.io/guideline/ios_guide/)

[iOS SDK 开发教程](http://docs.jpush.io/client/ios_tutorials/)


