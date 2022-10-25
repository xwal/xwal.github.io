title: iOS 支付
date: 2016-01-21 21:50:04
updated: 2016-01-21 21:50:04
tags:
- 支付宝支付
- 微信支付
- IAP
- 应用内支付
- Apple Pay
categories: iOS
---

iOS支付分为两类，**第三方支付**和**应用内支付（内购）**。

第三方支付包括：支付宝支付、微信支付、银联支付、百度钱包、京东支付等等。

应用内支付（In-App Purchase）：在应用程序内购买虚拟商品。如果你在App Store上销售的应用程序，将收到支付金额的70％。

<!--more-->

## 第三方支付

### 弹出方式

#### 网页

有些第三方支付没有安装客户端，可以直接弹出网页进行支付。（比如支付宝）

#### 调用APP

手机中安装了客户端可以跳转到APP中进行支付。微信支付只能调用App进行支付。

### 支付宝支付

#### 相关资料

- 支付宝开放平台（SDK&开发文档）：<https://open.alipay.com/platform/home.htm>
- 移动支付集成：<https://doc.open.alipay.com/doc2/detail?treeId=59&articleId=103563&docType=1>
- 商户服务平台（与支付宝签约需要填写的公司资料）：<https://b.alipay.com/newIndex.htm>

#### 支付流程

1. 在商户服务平台先与支付宝签约，获得商户ID（partner）和账号ID（seller），需要提供公司资质或者营业执照，个人无法申请。

   文档地址：<https://doc.open.alipay.com/doc2/detail?treeId=58&articleId=103542&docType=1>

2. 生成并下载相应的公钥私钥文件（加密签名用）

   文档地址：<https://doc.open.alipay.com/doc2/detail.htm?spm=0.0.0.0.POMYKl&treeId=58&articleId=103543&docType=1>

3. 下载支付宝SDK：<https://doc.open.alipay.com/doc2/detail?treeId=54&articleId=103419&docType=1>

4. 生成订单信息

5. 调用支付宝客户端，由支付宝客户端跟支付宝安全服务器打交道

6. 支付完毕后返回支付结果给商户客户端和服务器

SDK里有集成支付宝功能的一个Demo，集成支付功能的具体操作方式，可以参考Demo。

#### 代码集成流程

参考文档地址：<https://doc.open.alipay.com/doc2/detail.htm?spm=0.0.0.0.efmKDS&treeId=59&articleId=103676&docType=1>

1. 下载官方SDK

   下载地址：<https://doc.open.alipay.com/doc2/detail?treeId=54&articleId=103419&docType=1>

   本Demo使用的SDK是从官方Demo整理出来的，整理的SDK版本：201501022。

   目录结构如下：

   ```
   ├── AlipaySDK.bundle
   ├── AlipaySDK.framework
   ├── Order.h
   ├── Order.m
   ├── Util
   ├── libcrypto.a
   ├── libssl.a
   └── openssl
   ```

   其中：

   - `AlipaySDK.bundle`和`AlipaySDK.framework`是支付宝SDK
   - `Order`类：定义订单信息
   - `Util、libcrypto.a、libssl.a、openssl`：数据签名，对订单信息进行加密

2. 添加依赖库

   ![](https://img.alicdn.com/top/i1/LB1PlBHKpXXXXXoXXXXXXXXXXXX)

   其中，需要注意的是：

   如果是Xcode 7.0之后的版本，需要添加libc++.tbd、libz.tbd；

   如果是Xcode 7.0之前的版本，需要添加libc++.dylib、libz.dylib。

3. 创建`prefix header file`PCH文件，添加`#import <Foundation/Foundation.h>`

   在`Build Settings`中的`prefix header`设置pch文件路径

4. 在`Build Settings`中`Header Search Paths`添加头文件引用路径，`[文件路径]/AlipaySDK/`

5. 在需要调用AlipaySDK的文件中，增加头文件引用。

   ```
   #import  <AlipaySDK/AlipaySDK.h>
   #import "Order.h"
   #import "DataSigner.h"
   ```

6. 生成订单信息及签名

   ```
   //将商品信息赋予AlixPayOrder的成员变量
   Order *order = [[Order alloc] init];
   order.partner = PartnerID; // 商户ID
   order.seller = SellerID; // 账号ID
   order.tradeNO = @"20150923"; //订单ID（由商家自行制定）
   order.productName = @"iPhone6s"; //商品标题
   order.productDescription = @"新年打折"; //商品描述
   order.amount = @"0.01"; //商品价格(单位：元)
   order.notifyURL =  @"http://www.chaosky.me"; //回调URL，支付成功或者失败回调通知自己的服务器进行订单状态变更
   order.service = @"mobile.securitypay.pay";
   order.paymentType = @"1";
   order.inputCharset = @"utf-8";
   order.itBPay = @"30m";
   order.showUrl = @"m.alipay.com";

   // 应用注册scheme,在AlixPayDemo-Info.plist定义URL types
   NSString *appScheme = @"AliPayDemo";

   //将商品信息拼接成字符串
   NSString *orderSpec = [order description];
   NSLog(@"orderSpec = %@",orderSpec);

   //获取私钥并将商户信息签名,外部商户可以根据情况存放私钥和签名,只需要遵循RSA签名规范,并将签名字符串base64编码和UrlEncode
   id<DataSigner> signer = CreateRSADataSigner(PartnerPrivKey);
   NSString *signedString = [signer signString:orderSpec];

   //将签名成功字符串格式化为订单字符串,请严格按照该格式
   NSString *orderString = nil;
   if (signedString != nil) {
       orderString = [NSString stringWithFormat:@"%@&sign=\"%@\"&sign_type=\"%@\"",
                      orderSpec, signedString, @"RSA"];

       [[AlipaySDK defaultService] payOrder:orderString fromScheme:appScheme callback:^(NSDictionary * resultDic) {
           NSLog(@"reslut = %@",resultDic);
       }];
   }
   ```

7. Xcode设置URL scheme

   iPhone SDK可以把你的App和一个自定义的URL Scheme绑定。该URL Scheme可用来从浏览器或别的App启动你的App。

   配置方法：打开info.plist文件，找到或者添加如图所示的键值对：

   ![](QQ20160121-1@2x.png)

   URL Scheme值为代码中对应的值，**必须一致**。

8. 配置支付宝客户端返回url处理方法

   AppDelegate.m文件中，增加引用代码：

   ```
   #import <AlipaySDK/AlipaySDK.h>
   ```

   在@implementation AppDelegate中增加如下代码：

   ```
   - (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
   {
       //如果极简开发包不可用，会跳转支付宝钱包进行支付，需要将支付宝钱包的支付结果回传给开发包
       if ([url.host isEqualToString:@"safepay"]) {
           [[AlipaySDK defaultService] processOrderWithPaymentResult:url standbyCallback:^(NSDictionary * resultDic) {
       //【由于在跳转支付宝客户端支付的过程中，商户app在后台很可能被系统kill了，所以pay接口的callback就会失效，请商户对standbyCallback返回的回调结果进行处理,就是在这个方法里面处理跟callback一样的逻辑】
               NSLog(@"result = %@",resultDic);
           }];
       }
       if ([url.host isEqualToString:@"platformapi"]){//支付宝钱包快登授权返回authCode
   
           [[AlipaySDK defaultService] processAuthResult:url standbyCallback:^(NSDictionary * resultDic) {
               //【由于在跳转支付宝客户端支付的过程中，商户app在后台很可能被系统kill了，所以pay接口的callback就会失效，请商户对standbyCallback返回的回调结果进行处理,就是在这个方法里面处理跟callback一样的逻辑】
               NSLog(@"result = %@",resultDic);
           }];
       }
       return YES;
   }
   ```



### 微信支付

需要提供公司资质或者营业执照，个人无法申请。

#### 相关文档

- 微信开放平台：<https://open.weixin.qq.com>
- 微信支付商户平台：<https://pay.weixin.qq.com/index.php>
- 微信公众平台：<https://mp.weixin.qq.com>

#### 支付流程

1. 向微信注册你的应用程序id

   *开发者应用登记页面* 进行登记，登记并选择移动应用进行设置后，将获得AppID，可立即用于开发。但应用登记完成后还需要提交审核，只有审核通过的应用才能正式发布使用。

   ![](QQ20160121-0@2x.png)

2. 微信APP支付接入商户服务中心

   参考文档链接：<https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419317780&token=&lang=zh_CN>

3. 下载微信SDK文件，如果在项目中应使用SDK的最新版。

   官方资源下载地址：<https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419319164&token=&lang=zh_CN>

   本Demo使用的SDK是从官方Demo整理出来的，整理的SDK版本：1.6.1。

   目录结构如下：

   ```
   ├── SDKExport
   │   ├── WXApi.h
   │   ├── WXApiObject.h
   │   ├── libWeChatSDK.a
   │   └── read_me.txt
   └── lib
       ├── ApiXml.h
       ├── ApiXml.mm
       ├── WXUtil.h
       ├── WXUtil.mm
       ├── payRequsestHandler.h
       └── payRequsestHandler.mm
   ```

   其中：

   `SDKExport`文件夹：SDK文件

   `lib`文件夹：工具类

4. 添加依赖库

   ```
   SystemConfiguration.framework
   libz.dylib
   libsqlite3.dylib
   libc++.dylib
   CoreTelephony.framework
   CoreGraphics.framework
   ```

5. Xcode设置URL scheme

    在Xcode中，选择你的工程设置项，选中“TARGETS”一栏，在“info”标签栏的“URL type“添加“URL scheme”为你所注册的应用程序id（如下图所示）。

   ![](QQ20160121-2@2x.png)

6. 在你需要使用微信终端API的文件中import WXApi.h 头文件，并增加 WXApiDelegate 协议。

   ```
   // 微信所有的API接口
   #import "WXApi.h"
   // APP端签名相关头文件
   #import "payRequsestHandler.h"
   @interface AppDelegate ()<WXApiDelegate>
   @end
   ```

7. 要使你的程序启动后微信终端能响应你的程序，必须在代码中向微信终端注册你的id。（如下图所示，在 AppDelegate 的 didFinishLaunchingWithOptions 函数中向微信注册id）。

   ```
   - (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
       // Override point for customization after application launch.
       //向微信注册
       [WXApi registerApp:APP_ID withDescription:@"demo 2.0"];
       return YES;
   }
   ```

   重写AppDelegate的handleOpenURL和openURL方法：

   ```
   - (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url
   {
       return [WXApi handleOpenURL:url delegate:self];
   }

   - (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation
   {
       return [WXApi handleOpenURL:url delegate:self];
   }
   ```

8. 现在，你的程序要实现和微信终端交互的具体请求与回应，因此需要实现WXApiDelegate协议的两个方法：

   ```
   -(void) onReq:(BaseReq*)req
   {
       if([req isKindOfClass:[GetMessageFromWXReq class]])
       {
           // 微信请求App提供内容， 需要app提供内容后使用sendRsp返回
           NSString * strTitle = [NSString stringWithFormat:@"微信请求App提供内容"];
           NSString * strMsg = @"微信请求App提供内容，App要调用sendResp:GetMessageFromWXResp返回给微信";
   
           UIAlertView * alert = [[UIAlertView alloc] initWithTitle:strTitle message:strMsg delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
           alert.tag = 1000;
           [alert show];
       }
       else if([req isKindOfClass:[ShowMessageFromWXReq class]])
       {
           ShowMessageFromWXReq *  temp = (ShowMessageFromWXReq*)req;
           WXMediaMessage * msg = temp.message;
   
           //显示微信传过来的内容
           WXAppExtendObject * obj = msg.mediaObject;
   
           NSString * strTitle = [NSString stringWithFormat:@"微信请求App显示内容"];
           NSString * strMsg = [NSString stringWithFormat:@"标题：%@ \n内容：%@ \n附带信息：%@ \n缩略图:%lu bytes\n\n", msg.title, msg.description, obj.extInfo, msg.thumbData.length];
   
           UIAlertView * alert = [[UIAlertView alloc] initWithTitle:strTitle message:strMsg delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
           [alert show];
       }
       else if([req isKindOfClass:[LaunchFromWXReq class]])
       {
           //从微信启动App
           NSString * strTitle = [NSString stringWithFormat:@"从微信启动"];
           NSString * strMsg = @"这是从微信启动的消息";
           UIAlertView * alert = [[UIAlertView alloc] initWithTitle:strTitle message:strMsg delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
           [alert show];
       }
   }
   ```

   onReq是微信终端向第三方程序发起请求，要求第三方程序响应。第三方程序响应完后必须调用sendRsp返回。在调用sendRsp返回时，会切回到微信终端程序界面。

   ```
   -(void) onResp:(BaseResp*)resp
    {
        NSString * strMsg = [NSString stringWithFormat:@"errcode:%d", resp.errCode];
        NSString * strTitle;
   
        if([resp isKindOfClass:[SendMessageToWXResp class]])
        {
            strTitle = [NSString stringWithFormat:@"发送媒体消息结果"];
        }
        if([resp isKindOfClass:[PayResp class]]){
            //支付返回结果，实际支付结果需要去微信服务器端查询
            strTitle = [NSString stringWithFormat:@"支付结果"];
   
            switch (resp.errCode) {
                case WXSuccess:
                    strMsg = @"支付结果：成功！";
                    NSLog(@"支付成功－PaySuccess，retcode = %d", resp.errCode);
                    break;
   
                default:
                    strMsg = [NSString stringWithFormat:@"支付结果：失败！retcode = %d, retstr = %@", resp.errCode,resp.errStr];
                    NSLog(@"错误，retcode = %d, retstr = %@", resp.errCode,resp.errStr);
                    break;
            }
        }
        UIAlertView * alert = [[UIAlertView alloc] initWithTitle:strTitle message:strMsg delegate:self cancelButtonTitle:@"OK" otherButtonTitles:nil, nil];
        [alert show];
    }
   ```

   如果第三方程序向微信发送了sendReq的请求，那么onResp会被回调。sendReq请求调用后，会切到微信终端程序界面



## 应用内支付（In-App Purchase）

在应用程序内购买虚拟商品。如果你在App Store上销售的应用程序，将收到支付金额的70％。

### 相关资料

沙盒测试账号：imetax@hotmail.com 密码：Test1000phone

### 支付流程

#### 配置App ID

1. 为应用建立建立一个不带通配符的App ID
2. 用该App ID生成和安装相应的Provisioning Profile文件。

#### 配置iTunes Connect

1. 填写相关的税务，银行，联系人信息

   ![](Snip20160124_5.png)

   参考链接：[iOS App提交指南(二)-协议、税务和银行业务](http://www.jianshu.com/p/c7cf65911bc1)

2. 添加一个用于在sandbox付费的测试用户

   ![](Snip20160124_3.png)

   ![](Snip20160124_4.png)

3. 用该App ID创建一个新的应用。

4. 创建应用内付费项目，选择付费类型。

   ![](QQ20160124-0@2x.png)

   ![](QQ20160124-1@2x.png)

   App 内购买项目摘要填写  

   ![](Snip20160124_1.png)

   ![](Snip20160124_2.png)

#### 主要代码实现

1. 在工程中引入 `StoreKit.framework` 和` #import <StoreKit/StoreKit.h>`

2. 获得所有的付费Product ID列表。这个可以用常量存储在本地，也可以由自己的服务器返回。

   ```
   //在内购项目中创建的商品单号
   #define ProductID_IAP_FTHJ @"com.1000phone.IAPDemo.fthj_purple" // 方天画戟 488元
   #define ProductID_IAP_XYJ @"com.1000phone.IAPDemo.xyj" // 轩辕剑 6,498元
   #define ProductID_IAP_JB @"com.1000phone.IAPDemo.jb" // 金币 6元=6金币
   ```

   

3. 制作界面，展示所有的应用内付费项目。这些应用内付费项目的价格和介绍信息可以从App Store服务器请求，也可以是自己的服务器返回。向App Store查询速度非常慢，通常需要2-3秒钟，最好从服务器请求。

   ```
   - (void)createViews
   {
       NSArray * buttonNames = @[@"轩辕剑 6498元", @"方天画戟 488元", @"金币6元=6金币"];
       __weak typeof(self) weakSelf = self;
       [buttonNames enumerateObjectsUsingBlock:^(NSString * buttonName, NSUInteger idx, BOOL * stop) {
           UIButton * button = [UIButton buttonWithType:UIButtonTypeSystem];
           [weakSelf.view addSubview:button];
           button.frame = CGRectMake(100, 100 + idx   * 60, 150, 50);
           button.titleLabel.font = [UIFont systemFontOfSize:18];
           [button setTitle:buttonName forState:UIControlStateNormal];

           // 设置tag值
           button.tag = PAY_BUTTON_BEGIN_TAG + idx;
           [button addTarget:self action:@selector(buyProduct:) forControlEvents:UIControlEventTouchUpInside];
       }];
   }

   - (void)buyProduct:(UIButton *) sender
   {

   }
   ```

   

4. 当用户点击了一个IAP项目，我们先查询用户是否允许应用内付费。

   ```
   - (void)buyProduct:(UIButton *) sender
   {
       self.buyType = sender.tag - PAY_BUTTON_BEGIN_TAG;
       if ([SKPaymentQueue canMakePayments]) {
           // 执行下面提到的第5步：
           [self requestProductData];
           NSLog(@"允许程序内付费购买");
       }
       else
       {
           NSLog(@"不允许程序内付费购买");
           UIAlertView *alerView =  [[UIAlertView alloc] initWithTitle:@"提示"
                                                               message:@"您的手机没有打开程序内付费购买"
                                                              delegate:nil cancelButtonTitle:NSLocalizedString(@"关闭",nil) otherButtonTitles:nil];

           [alerView show];

       }
   }
   ```

5. 我们先通过该IAP的ProductID向AppStore查询，获得SKPayment实例，然后通过SKPaymentQueue的 addPayment方法发起一个购买的操作。

   ```
   // 下面的ProductId应该是事先在itunesConnect中添加好的，已存在的付费项目。否则查询会失败。
   - (void)requestProductData {
      NSLog(@"---------请求对应的产品信息------------");
      NSArray *product = nil;
      switch (self.buyType) {
          case 0:
              product = [NSArray arrayWithObject:ProductID_IAP_XYJ];
              break;
          case 1:
              product = [NSArray arrayWithObject:ProductID_IAP_FTHJ];
              break;
          case 2:
              product = [NSArray arrayWithObject:ProductID_IAP_JB];
              break;
      }
      NSSet *nsset = [NSSet setWithArray:product];
      SKProductsRequest *request=[[SKProductsRequest alloc] initWithProductIdentifiers: nsset];
      request.delegate=self;
      [request start];
   }

   #pragma mark - SKProductsRequestDelegate
   // 收到的产品信息回调
   - (void)productsRequest:(SKProductsRequest *)request didReceiveResponse:(SKProductsResponse *)response{

      NSLog(@"-----------收到产品反馈信息--------------");
      NSArray *myProduct = response.products;
      if (myProduct.count == 0) {
          NSLog(@"无法获取产品信息，购买失败。");
          return;
      }
      NSLog(@"产品Product ID:%@",response.invalidProductIdentifiers);
      NSLog(@"产品付费数量: %d", (int)[myProduct count]);
      // populate UI
      for(SKProduct *product in myProduct){
          NSLog(@"product info");
          NSLog(@"SKProduct 描述信息%@", [product description]);
          NSLog(@"产品标题 %@" , product.localizedTitle);
          NSLog(@"产品描述信息: %@" , product.localizedDescription);
          NSLog(@"价格: %@" , product.price);
          NSLog(@"Product id: %@" , product.productIdentifier);
      }
      SKPayment * payment = [SKPayment paymentWithProduct:myProduct[0]];
      NSLog(@"---------发送购买请求------------");
      [[SKPaymentQueue defaultQueue] addPayment:payment];

   }

   //弹出错误信息
   - (void)request:(SKRequest *)request didFailWithError:(NSError *)error{
      NSLog(@"-------弹出错误信息----------");
      UIAlertView *alerView =  [[UIAlertView alloc] initWithTitle:NSLocalizedString(@"Alert",NULL) message:[error localizedDescription]
                                                         delegate:nil cancelButtonTitle:NSLocalizedString(@"Close",nil) otherButtonTitles:nil];
      [alerView show];

   }

   -(void) requestDidFinish:(SKRequest *)request
   {
      NSLog(@"----------反馈信息结束--------------");

   }
   ```

6. 在viewDidLoad方法中，将购买页面设置成购买的Observer。

   ```
   - (void)viewDidLoad {
       [super viewDidLoad];
       [self createViews];
       // 监听购买结果
       [[SKPaymentQueue defaultQueue] addTransactionObserver:self];
   }

   - (void)dealloc
   {
       [[SKPaymentQueue defaultQueue] removeTransactionObserver:self];
   }
   ```

7. 当用户购买的操作有结果时，就会触发下面的回调函数，相应进行处理即可。

   ```
   #pragma mark - SKPaymentTransactionObserver
   // 处理交易结果
   - (void)paymentQueue:(SKPaymentQueue *)queue updatedTransactions:(NSArray *)transactions {
       for (SKPaymentTransaction *transaction in transactions)
       {
           switch (transaction.transactionState)
           {
               case SKPaymentTransactionStatePurchased://交易完成
                   NSLog(@"transactionIdentifier = %@", transaction.transactionIdentifier);
                   [self completeTransaction:transaction];
                   break;
               case SKPaymentTransactionStateFailed://交易失败
                   [self failedTransaction:transaction];
                   break;
               case SKPaymentTransactionStateRestored://已经购买过该商品
                   [self restoreTransaction:transaction];
                   break;
               case SKPaymentTransactionStatePurchasing:      //商品添加进列表
                   NSLog(@"商品添加进列表");
                   break;
               default:
                   break;
           }
       }

   }

   // 交易完成
   - (void)completeTransaction:(SKPaymentTransaction *)transaction {
       NSString * productIdentifier = transaction.payment.productIdentifier;
   //    NSString * receipt = [transaction.transactionReceipt base64EncodedString];
       if ([productIdentifier length] > 0) {
           // 向自己的服务器验证购买凭证
       }

       // Remove the transaction from the payment queue.
       [[SKPaymentQueue defaultQueue] finishTransaction: transaction];

   }

   // 交易失败
   - (void)failedTransaction:(SKPaymentTransaction *)transaction {
       if(transaction.error.code != SKErrorPaymentCancelled) {
           NSLog(@"购买失败");
       } else {
           NSLog(@"用户取消交易");
       }
       [[SKPaymentQueue defaultQueue] finishTransaction: transaction];
   }

   // 已购商品
   - (void)restoreTransaction:(SKPaymentTransaction *)transaction {
       // 对于已购商品，处理恢复购买的逻辑
       [[SKPaymentQueue defaultQueue] finishTransaction: transaction];
   }
   ```

8. 服务器验证凭证(Optional)。如果购买成功，我们需要将凭证发送到服务器上进行验证。考虑到网络异常情况，iOS端的发送凭证操作应该进行持久化，如果程序退出，崩溃或网络异常，可以恢复重试。

### 参考链接

1. [iOS开发内购全套图文教程](http://www.jianshu.com/p/86ac7d3b593a)
2. [iOS应用内付费(IAP)开发步骤列表](http://blog.devtang.com/blog/2012/12/09/in-app-purchase-check-list/)
3. [iOS内购实现及测试Check List](http://onevcat.com/2013/11/ios-iap-checklist/)

## 苹果支付（ Pay）

苹果支付是一种在应用内运行的具有隐秘性和安全性非接触式的支付方式。它允许触摸付款，你可以用来购买实体商品和服务。

Apple 不会存储或共享客户的实际信用卡和借记卡卡号，因此商家和 App 开发者无需负责管理和保护实际的信用卡和借记卡卡号。

![](https://developer.apple.com/apple-pay/images/figure-1-payment-sheet-cn_2x.png)

![](https://developer.apple.com/apple-pay/images/figure-2-payment-flow-cn_2x.png)

### 先决条件

除了使用 PassKit 框架实施 Apple Pay 之外，您还必须：

- 通过[付款处理机构或网关](https://developer.apple.com/apple-pay/)设置一个帐户。

- 通过“[证书、标识符和描述文件](https://developer.apple.com/account/ios/identifiers/merchant/merchantLanding.action)”（“Certificates, Identifiers & Profiles”）注册一个商家 ID。
- 生成一个 [Apple Pay 证书](https://developer.apple.com/account/ios/certificate/certificateCreate.action)，用于加密和解密付款令牌。
- 在您的 App 中包括一个 Apple Pay 授权。
- 遵循“应用审核准则”的第 29 节中列出的要求。
- 遵循[《App 审核准则》](https://developer.apple.com/app-store/review/guidelines/#apple-pay)(“App Review Guidelines”)第 29 节中列出的要求。

### 支付流程

#### 配置 Merchant ID（商家ID）

Apple Pay 中的商家 ID 用于标识你能够接受付款。与商家 ID 相关联的公钥与证书用于在支付过程中加密支付信息。要想使用 Apple Pay，你首先需要注册一个商家 ID 并且配置它的证书。

1. 在开发者中心选择[证书、标识符及描述文件](https://developer.apple.com/account/ios/identifiers/merchant/merchantLanding.action)
2. 在标识符下选择商家 ID，点击右上角的添加按钮(+)。
	![Snip20160808_3](2016-08-08-Snip20160808_3.png)
3. 输入描述与和标识符，然后继续，检查设置然后点击注册，点击完成。
	![Snip20160808_5](2016-08-08-Snip20160808_5.png)

4. 为商家 ID 配置证书，在开发者中心选择[证书、标识符及描述文件](https://developer.apple.com/account/ios/identifiers/merchant/merchantLanding.action)，在标识符下选择商家 ID。从列表中选择商家 ID，点击编辑。
	![Snip20160808_6](2016-08-08-Snip20160808_6.png)
	![Snip20160808_8](2016-08-08-Snip20160808_8.png)

5. 点击创建证书， 根据提示生成证书签名请求（CSR），选择你的 CSR，然后点击生成下载证书。
	![Snip20160808_10](2016-08-08-Snip20160808_10.png)
	![Snip20160808_11](2016-08-08-Snip20160808_11.png)
	![Snip20160808_12](2016-08-08-Snip20160808_12.png)

6. 如果你在钥匙串访问 (Keychain Access) 看到警告信息：该证书由一个未知的机构签发或者该证书有一个无效的发行人，请将 [WWDR 中级证书 - G2](https://www.apple.com/certificateauthority/AppleWWDRCAG2.cer) 以及 [Apple 根证书 - G2](https://www.apple.com/certificateauthority/AppleRootCA-G2.cer) 安装到你的钥匙串中。你可以在 <https://www.apple.com/certificateauthority/> 下载到这两个证书。
	![Snip20160808_13](2016-08-08-Snip20160808_13.png)
	![Snip20160808_15](2016-08-08-Snip20160808_15.png)

#### 配置 App ID

1. 为应用建立建立一个不带通配符的App ID，并勾选上【Apple Pay】。
	![Snip20160808_19](2016-08-08-Snip20160808_19.png)
2. 在App IDs列表中编辑该App ID，进行Apple Pay的关联。
	![Snip20160808_20](2016-08-08-Snip20160808_20.png)
	![Snip20160808_21](2016-08-08-Snip20160808_21.png)
	![Snip20160808_24](2016-08-08-Snip20160808_24.png)
	![Snip20160808_25](2016-08-08-Snip20160808_25.png)
3. 用该App ID生成和安装相应的Provisioning Profile文件。

#### 代码实现

##### Xcode工程配置

在 Xcode 的 【capabilities 面板】中为应用启用 【Apple Pay】功能。在 Apple Pay 这一行中点击开启，然后指定该应用使用的商家 ID 即可。
![Snip20160808_17](2016-08-08-Snip20160808_17.png)

##### 判断用户是否能够支付

1. 调用`PKPaymentAuthorizationViewController` 的 `canMakePayments` 方法可以判断当前设备是否支持 Apple Pay。

	```
	// 判断是否支持Apple Pay
	if ([PKPaymentAuthorizationViewController canMakePayments]) {
	}
	```

	如果 `canMakePayments` 返回 NO，则设备不支持 Apple Pay。不要显示 Apple Pay 按扭，你可以选择使用其它的支付方式。

2. 调用 `PKPaymentAuthorizationViewController` 的方法 `canMakePaymentsUsingNetworks:(NSArray<NSString *> *)supportedNetworks` 判断用户是否能使用你支持的支付网络完成付款。  

    `canMakePaymentsUsingNetworks:`方法需要传递一个支持的支付网络数组。支付网络包括以下类型：

	```
	extern NSString * const PKPaymentNetworkAmex NS_AVAILABLE(NA, 8_0);	// 美国运通卡
	extern NSString * const PKPaymentNetworkChinaUnionPay NS_AVAILABLE(NA, 9_2);	// 中国银联卡
	extern NSString * const PKPaymentNetworkDiscover NS_AVAILABLE(NA, 9_0);	// 美国发现卡
	extern NSString * const PKPaymentNetworkInterac NS_AVAILABLE(NA, 9_2);	// 加拿大Interac银行卡
	extern NSString * const PKPaymentNetworkMasterCard NS_AVAILABLE(NA, 8_0);	// 万事达卡
	extern NSString * const PKPaymentNetworkPrivateLabel NS_AVAILABLE(NA, 9_0);	// 信用卡、借记卡
	extern NSString * const PKPaymentNetworkVisa NS_AVAILABLE(NA, 8_0);	// 维萨卡
	```

	如果 `canMakePayementsUsingNetworks: `返回 NO，则表示设备支持 Apple Pay，但是用户并没有为任何请求的支付网络添加银行卡。你可以选择显示一个支付设置按扭，引导用户添加银行卡。如果用户点击该按扭，则开始设置新的银行卡流程 (例如，通过调用 openPaymentSetup 方法)。

	```
	// 引导用户添加银行卡
	// 判断是否能打开卡包
	if ([PKPassLibrary isPassLibraryAvailable]) {
	   PKPassLibrary * pk = [[PKPassLibrary alloc] init];
	   [pk openPaymentSetup];
	}
	```

    ```
    // 银行卡类型
    NSArray * supportedNetworks = @[PKPaymentNetworkChinaUnionPay, PKPaymentNetworkPrivateLabel, PKPaymentNetworkInterac];
    
    // 判断是否支持Apple Pay
    if ([PKPaymentAuthorizationViewController canMakePayments]) {
       self.paymentButton = [PKPaymentButton buttonWithType:PKPaymentButtonTypeBuy style:PKPaymentButtonStyleWhiteOutline];
       [self.paymentButton addTarget:self action:@selector(paymentTapped:) forControlEvents:UIControlEventTouchUpInside];
    }
    else if ([PKPaymentAuthorizationViewController canMakePaymentsUsingNetworks:supportedNetworks]) {
       // 添加银行卡
       self.paymentButton = [[PKPaymentButton alloc] initWithPaymentButtonType:PKPaymentButtonTypeSetUp paymentButtonStyle:PKPaymentButtonStyleWhiteOutline];
       [self.paymentButton addTarget:self action:@selector(paymentSetupTapped:) forControlEvents:UIControlEventTouchUpInside];
    }
    
    if (self.paymentButton != nil) {
       [self.view addSubview:self.paymentButton];
       self.paymentButton.center = CGPointMake(200, 100);
    }
    ```

    ```
    - (void)paymentSetupTapped:(PKPaymentButton *) sender {
       // 判断是否打开卡包
       if ([PKPassLibrary isPassLibraryAvailable]) {
           PKPassLibrary * pk = [[PKPassLibrary alloc] init];
           [pk openPaymentSetup];
       }
    }
    ```

##### 显示支付按钮

使用 `PKPayementButton` 方法在初始化支付请求时创建带商标的 Apple Pay 按扭。

```
+ (instancetype)buttonWithType:(PKPaymentButtonType)buttonType style:(PKPaymentButtonStyle)buttonStyle;
```

PKPaymentButtonType按钮类型：

```
PKPaymentButtonTypePlain = 0,  // 显示文字【Pay】
PKPaymentButtonTypeBuy,		  // 显示文字【Buy with Pay】
PKPaymentButtonTypeSetUp NS_ENUM_AVAILABLE_IOS(9_0) // 显示文字【Set up Pay】
```

PKPaymentButtonStyle样式类型：

```
PKPaymentButtonStyleWhite = 0, // 白底黑字
PKPaymentButtonStyleWhiteOutline, // 白底黑字，黑色边框
PKPaymentButtonStyleBlack		  // 黑底白字
```


##### 创建支付请求

支付请求是 PKPayementRequest 类的一个实例。一个支持请求包含用户支付的物品概要清单、可选配送方式列表、用户需提供的配送信息、商家的信息以及支付处理机构。

```
- (void)paymentTapped:(PKPaymentButton *) sender {
    // 创建支付请求
    PKPaymentRequest * paymentRequest = [[PKPaymentRequest alloc] init];

    // 配置商家ID
    paymentRequest.merchantIdentifier = @"merchant.me.chaosky.applepay";

    // 配置货币代码及国家代码
    paymentRequest.currencyCode = @"CNY";
    paymentRequest.countryCode = @"CN";

    // 支持的支付网络，用户能使用类型的银行卡
    paymentRequest.supportedNetworks = @[PKPaymentNetworkChinaUnionPay, PKPaymentNetworkPrivateLabel];

    // 商家支付能力，商家的支付网络
    paymentRequest.merchantCapabilities = PKMerchantCapability3DS | PKMerchantCapabilityEMV;

    // 是否显示发票收货地址
    paymentRequest.requiredBillingAddressFields = PKAddressFieldNone;

    // 是否显示快递地址
    paymentRequest.requiredShippingAddressFields = PKAddressFieldAll;


    // 自定义联系信息
    PKContact *contact = [[PKContact alloc] init];

    NSPersonNameComponents *name = [[NSPersonNameComponents alloc] init];
    name.givenName = @"天祥";
    name.familyName = @"林";
    contact.name = name;

    CNMutablePostalAddress *address = [[CNMutablePostalAddress alloc] init];
    address.street = @"天府广场";
    address.city = @"成都";
    address.state = @"四川";
    address.postalCode = @"614100";
    contact.postalAddress = address;

    contact.emailAddress = @"chaosky.me@gmail.com";
    contact.phoneNumber = [CNPhoneNumber phoneNumberWithStringValue:@"1234567890"];
    paymentRequest.shippingContact = contact;

    // 配送方式
    paymentRequest.shippingMethods = [self shippingMethodsForContact:contact];

    // 默认配送类型
    paymentRequest.shippingType = PKShippingTypeShipping;

    // 更新邮费
    self.selectedShippingMethod = paymentRequest.shippingMethods[0];
    [self updateShippingCost:self.selectedShippingMethod];

    // 支付汇总项
    paymentRequest.paymentSummaryItems = self.summaryItems;

    // 附加数据
    paymentRequest.applicationData = [@"buyid=123456" dataUsingEncoding:NSUTF8StringEncoding];

    // 验证用户支付授权
    PKPaymentAuthorizationViewController * paymentAuthVC = [[PKPaymentAuthorizationViewController alloc] initWithPaymentRequest:paymentRequest];
    paymentAuthVC.delegate = self;

    [self presentViewController:paymentAuthVC animated:YES completion:nil];
}

// 更新邮费
- (void)updateShippingCost:(PKShippingMethod *) shippingMethod {
    // 支付汇总项
    // 12.75 小计
    NSDecimalNumber * subtotalAmount = [NSDecimalNumber decimalNumberWithMantissa:1275 exponent:-2 isNegative:NO];
    PKPaymentSummaryItem * subtotal = [PKPaymentSummaryItem summaryItemWithLabel:@"小计" amount:subtotalAmount];

    // 2.00 折扣优惠
    NSDecimalNumber * discountAmount = [NSDecimalNumber decimalNumberWithMantissa:200 exponent:-2 isNegative:YES];
    PKPaymentSummaryItem * discount = [PKPaymentSummaryItem summaryItemWithLabel:@"折扣" amount:discountAmount];

    // 邮费
    PKPaymentSummaryItem * shippingCost = [PKPaymentSummaryItem summaryItemWithLabel:@"邮费" amount:shippingMethod.amount];

    // 总计项
    // 总计
    NSDecimalNumber *totalAmount = [NSDecimalNumber zero];
    totalAmount = [totalAmount decimalNumberByAdding:subtotal.amount];
    totalAmount = [totalAmount decimalNumberByAdding:discount.amount];
    totalAmount = [totalAmount decimalNumberByAdding:shippingCost.amount];
    PKPaymentSummaryItem * total = [PKPaymentSummaryItem summaryItemWithLabel:@"千锋互联" amount:totalAmount];

    self.summaryItems = @[subtotal, discount, shippingCost, total];
}

// 根据用户地址获取配送方式
- (NSArray *)shippingMethodsForContact:(PKContact *) contact {
    //配置快递方式
    NSDecimalNumber * sfAmount = [NSDecimalNumber decimalNumberWithString:@"20.00"];
    PKShippingMethod * sfShipping = [PKShippingMethod summaryItemWithLabel:@"顺丰" amount:sfAmount];
    sfShipping.identifier = @"shunfeng";
    sfShipping.detail = @"24小时内送达";

    NSDecimalNumber * stAmount = [NSDecimalNumber decimalNumberWithString:@"10.00"];
    PKShippingMethod * stShipping = [PKShippingMethod summaryItemWithLabel:@"申通" amount:stAmount];
    stShipping.identifier = @"shentong";
    stShipping.detail = @"3天内送达";

    NSDecimalNumber * tcAmount = [NSDecimalNumber decimalNumberWithString:@"8.00"];
    PKShippingMethod * tcShipping = [PKShippingMethod summaryItemWithLabel:@"同城快递" amount:tcAmount];
    tcShipping.identifier = @"tongcheng";
    tcShipping.detail = @"12小时送达";

    NSArray * shippingMethods = nil;
    if ([contact.postalAddress.city isEqualToString:@"成都"]) {
        shippingMethods = [NSArray arrayWithObjects:sfShipping, stShipping, tcShipping, nil];
    }
    else {
        shippingMethods = @[sfShipping, stShipping];
    }

    return shippingMethods;
}
```

PKMerchantCapability枚举类型

```
//    PKMerchantCapability3DS                                 = 1UL << 0,   // 3DS卡（磁条卡）
//    PKMerchantCapabilityEMV                                 = 1UL << 1,   // EMV卡（IC卡）
//    PKMerchantCapabilityCredit NS_ENUM_AVAILABLE_IOS(9_0)   = 1UL << 2,   // 信用卡
//    PKMerchantCapabilityDebit  NS_ENUM_AVAILABLE_IOS(9_0)   = 1UL << 3    // 借记卡
```

PKAddressField枚举类型

```
//    PKAddressFieldNone                              = 0UL,      // 不需要地址
//    PKAddressFieldPostalAddress                     = 1UL << 0, // 完整街道地址，包括名字、街道、城市、地区/省份、邮编、国家
//    PKAddressFieldPhone                             = 1UL << 1, // 电话号码
//    PKAddressFieldEmail                             = 1UL << 2, // 邮箱
//    PKAddressFieldName NS_ENUM_AVAILABLE_IOS(8_3)   = 1UL << 3, // 名字
//    PKAddressFieldAll                               = (PKAddressFieldPostalAddress|PKAddressFieldPhone|PKAddressFieldEmail|PKAddressFieldName) // 以上所有都具备
```

// PKShippingType配送类型

```
//    PKShippingTypeShipping,   // 第三方配送（默认），如顺丰、申通
//    PKShippingTypeDelivery,   // 商家自己配送，如京东、披萨、花店、蛋糕店
//    PKShippingTypeStorePickup, // 上门取货
//    PKShippingTypeServicePickup // 服务收件，如京东设置的自提点
```

###### 一系列的支付汇总项

由 `PKPaymentSummaryItem` 类表示支付请求中的不同部分。一个支付请求包括多个支付汇总项，一般包括：小计、折扣、配送费用、税以及总计。如果你没有其它任何额外的费用 (例如，配送或税)，那么支付的总额直接是所有购买商品费用的总和。关于每一项商品的费用的详细信息你需要在应用程序的其它合适位置显示。

每一个汇总项都有标签和金额两个部分。标签是对该项的可读描述。金额对应于所需支付的金额。一个支付请求中的所有金额都使用该请求中指定的支付货币类型。对于折扣和优惠券，其金额被设置为负值。

某些场景下，如果在支付授权的时候还不能获取应当支付的费用(例如，出租车收费)，则使用 `PKPaymentSummaryItemTypePending` 类型做小计项，并将其金额值设置为 0.0。系统随后会设置该项的金额值。

汇总项列表中最后一项是总计项。总计项的金额是其它所有汇总项的金额的和。总计项的显示不同用于其它项。在该项中，你应该使用你的公司名称作为其标签，使用所有其它项的金额之和作为其金额值。最后，使用 paymentSummaryItems 属性将所有汇总项都添加到支付请求中。

> 汇总项使用 NSDecimalNumber 类存储金额，并且金额使用 10 进制数表示。如示例代码演示的一样，可以通过显示地指定小数部分与指数部分创建该类的实例，也可以直接使用字符串的方式指定金额。在财务计算中绝大部分情况下都是使用的 10 进制数进行计算的，例如，计算 5% 的折扣。

###### 配送方式的支付汇总项

为每一个可选的配送方式创建一个 `PKShippingMethod` 实例。与其它支付汇总项一样，配送方式也有一个用户可读的标签，例如标准配送或者可隔天配送，和一个配送金额值。与其它汇总项不同的是，配送方法有一个 detail 属性值，例如，7 月 29 日送达或者 24 小时之内送达等等。该属性值说明不同配送方式之间的区别。

为了在委托方法中区分不同的配送方式，你可以使用 identifier 属性。有些配送方式并不是在所有地区都是可以使用的，或者它们费用会根据配送地址的不同而发生变化。你需要在用户选择配送地址或方法时更新其信息。

###### 指定应用程序支持的支付处理机制

merchantCapabilities 属性值说明应用程序支持的支付处理协议。3DS 协议是须支持的支付处理协议， EMV 是可选的支付处理协议。

```
// Supports 3DS only
paymentRequest.merchantCapabilities = PKMerchantCapability3DS;

// Supports both 3DS and EMV
paymentRequest.merchantCapabilities = PKMerchantCapability3DS | PKMerchantCapabilityEMV;
```

###### 配送信息和账单信息

requiredBillingAddressFields 属性和 requiredShippingAddressFields 属性可以设置所需的账单信息和配送信息。

```
paymentRequest.requiredBillingAddressFields = PKAddressFieldEmail;
paymentRequest.requiredBillingAddressFields = PKAddressFieldEmail | PKAddressFieldPostalAddress;
```

如果已有最新账单信息以及配送联系信息，你可以直接为支付请求设置这些值。 Apple Pay 会默认使用这些信息。但是，用户仍然可以选择在本次支付中使用其它联系信息。

```
PKContact *contact = [[PKContact alloc] init];

NSPersonNameComponents *name = [[NSPersonNameComponents alloc] init];
name.givenName = @"天祥";
name.familyName = @"林";
contact.name = name;

CNMutablePostalAddress *address = [[CNMutablePostalAddress alloc] init];
address.street = @"天府广场";
address.city = @"成都";
address.state = @"四川";
address.postalCode = @"614100";
contact.postalAddress = address;

contact.emailAddress = @"chaosky.me@gmail.com";
contact.phoneNumber = [CNPhoneNumber phoneNumberWithStringValue:@"1234567890"];
paymentRequest.shippingContact = contact;
```

##### 授权支付

支付授权过程是由支付授权视图控制器与其委托合作完成的。支付授权视图控制器做了两件事：  

- 让用户选择支付请求所需的账单信息与配送信息。

- 让用户授权支付操作。

用户与视图控制器交互时，委托方法会被系统调用，所以在这些方法中你的应用可以更新所要显示的信息。例如在配送地址修改后更新配送价格。在用户授权支付请求后此方法还会被调用一次。

###### 使用委托方法更新配送方式与配送费用

当用户输入配送信息时，授权视图控制器会调用委托的 paymentAuthorizationViewController:didSelectShippingContact:completion: 方法和 paymentAuthorizationViewController:didSelectShippingMethod:completion: 方法。你可以实现这两个方法来更新你的支付请求。

```
// 用户更改配送地址
- (void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller didSelectShippingContact:(PKContact *)contact completion:(void (^)(PKPaymentAuthorizationStatus, NSArray<PKShippingMethod *> * _Nonnull, NSArray<PKPaymentSummaryItem *> * _Nonnull))completion {
    self.selectedContact = contact;

    NSArray *shippingMethods = [self shippingMethodsForContact:contact];
    // 重新计算邮费
    self.selectedShippingMethod = shippingMethods[0];
    [self updateShippingCost:self.selectedShippingMethod];

    completion(PKPaymentAuthorizationStatusSuccess, shippingMethods, self.summaryItems);
}

// 用户更改配送方式
- (void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller didSelectShippingMethod:(PKShippingMethod *)shippingMethod completion:(void (^)(PKPaymentAuthorizationStatus, NSArray<PKPaymentSummaryItem *> * _Nonnull))completion {
    self.selectedShippingMethod = shippingMethod;
    [self updateShippingCost: shippingMethod];
    completion(PKPaymentAuthorizationStatusSuccess, self.summaryItems);
}
```

###### 支付被授权时创建支付令牌

当用户授权一个支付请求时，支付框架的 Apple 服务器与安全模块会协作创建一个支付令牌。你可以在委托方法 `paymentAuthorizationViewController:didAuthorizePayment:completion:` 中将支付信息以及其它你需要处理的信息，例如配送地址和购物车标识符，一起发送至你的服务器。这个过程如下所示：

1. 支付框架将支付请求发送至安全模块。只有安全模块会访问令牌化后的设备相关的支付卡号。
2. 安全模块将特定卡的支付数据和商家信息一起加密(加密后的数据只有 Apple 可以访问)，然后将加密后的数据发送至支付框架。支付框架再将这些数据发送至 Apple 的服务器。
3. Apple 服务器使用商家标识证书将这些支付数据重新加密。这些令牌只能由你以及那些与你共享商户标识证书的人读取。随后服务器生成支付令牌再将其发送至设备。
4. 支付框架调用 paymentAuthorizationViewController:didAuthorizePayment:completion: 方法将令牌发送至你的委托。你在委托方法中再将其发送至你的服务器。

在服务器上的处理操作取决于你是自己处理支付还是使用其它支付平台。不过，在两种情况下服务器都得处理订单再将处理结果返回给设备。在设备上，委托再将处理结果传入完成处理方法中。

```
// 用户已经授权支付
- (void)paymentAuthorizationViewController:(PKPaymentAuthorizationViewController *)controller didAuthorizePayment:(PKPayment *)payment completion:(void (^)(PKPaymentAuthorizationStatus))completion
{
    // 将付款信息与其它处理订单的必需信息一起发送至你的服务器。如支付令牌、配送地址、账单地址。
    // ...

    // 从你的服务器获取支付授权状态，验证支付结果
    PKPaymentAuthorizationStatus status = PKPaymentAuthorizationStatusSuccess;
    completion(status);
}
```

###### 授权支付完成

支付框架显示完支付事务状态后，授权视图控制器会调用委托的 `aymentAuthorizationViewControllerDidFinish:` 方法。在此方法的实现中，你应该释放授权视图控制器然后再显示与应用相关的支付信息界面。

```
- (void) paymentAuthorizationViewControllerDidFinish:(PKPaymentAuthorizationViewController *)controller
{
    [controller dismissViewControllerAnimated:YES completion:nil];
}
```

##### 处理支付

处理一次付款事务一般包括以下几个步骤：

1. 将付款信息与其它处理订单的必需信息一起发送至你的服务器。
2. 验证付款数据的散列值与签名。
3. 解密出支付数据。
4. 将支付数据提交给付款处理网络。
5. 将订单信息提交至你的订单跟踪系统。

你有两种可选的方式处理付款过程：

1. 利用已有的支付平台来处理付款。
2. 自己实现付款过程。

一次付款的处理过程通常情况下包括上述的大部分步骤。

访问、验证以及处理付款信息都需要你懂得一些加密领域的知识，比如 SHA-1 哈希、访问和验证 PKCS #7 签名以及如何实现椭圆曲线 Diiffie-Hellman 密钥交换等。如果你没有这些加密的背景知识，我们建议你使用已有支付平台，它们会替你完成这些繁琐的操作。关于 Apple Pay 已支持的第三方支付平台，请参考 <https://developer.apple.com/apple-pay/>。

付款数据是嵌套结构。支付令牌是 PKPaymentToken 类的实例。其 paymentData 属性值是一个 JSON 字典。该 JSON 字典包括用于验证信息有效性头信息以及加密后的付款数据。加密后的支付数据包括付款金额、持卡人姓名以及其它特定支付处理协议的信息。

![付款数据的数据结构](https://developer.apple.com/library/ios/documentation/PassKit/Reference/PaymentTokenJSON/Art/payment_data_structure_2x.png)

更多关于付款数据的数据结构，请参考[支付令牌的格式](https://developer.apple.com/library/ios/documentation/PassKit/Reference/PaymentTokenJSON/PaymentTokenJSON.html#//apple_ref/doc/uid/TP40014929)。


### 参考资料

1. [官方Pay教程](https://developer.apple.com/apple-pay/)
2. [Apple Pay 中文入门](https://developer.apple.com/apple-pay/get-started/cn/)
3. [Apple Pay 编程指南](https://developer.apple.com/library/prerelease/content/ApplePay_Guide/index.html#//apple_ref/doc/uid/TP40014764-CH1-SW1)

##  Pay VS In-App Purchase

|      |                   Pay                   |             In-App Purchase              |
| ---- | :--------------------------------------: | :--------------------------------------: |
| 框架   |                 PassKit                  |                 StoreKit                 |
| 适用范围 | **实体商品**（如食品杂货、服装和电器）和**服务**（如俱乐部会员、酒店预订和活动门票） | **销售虚拟商品**，如适用于您的 App 的优质内容及订阅数字内容；程序内的内容和功能性；程序内货币服务；数码订阅 |
| 支付处理 |               自己的支付平台处理付款                |                 苹果公司处理付款                 |

## 代码下载

<https://github.com/xwal/Demo/tree/master/Payment>

