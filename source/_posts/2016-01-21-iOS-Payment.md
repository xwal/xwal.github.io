title: iOS 支付
date: 2016-01-21 21:50:04
tags:
- 支付宝支付
- 微信支付
- IAP
- 应用内支付
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

   下载地址：<http://7xooko.com1.z0.glb.clouddn.com/AlipaySDK.zip>

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

   ![](http://7xooko.com1.z0.glb.clouddn.com/QQ20160121-1@2x.png)

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

   ![](http://7xooko.com1.z0.glb.clouddn.com/QQ20160121-0@2x.png)

2. 微信APP支付接入商户服务中心

   参考文档链接：<https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419317780&token=&lang=zh_CN>

3. 下载微信SDK文件，如果在项目中应使用SDK的最新版。

   官方资源下载地址：<https://open.weixin.qq.com/cgi-bin/showdocument?action=dir_list&t=resource/res_list&verify=1&id=open1419319164&token=&lang=zh_CN>

   本Demo使用的SDK是从官方Demo整理出来的，整理的SDK版本：1.6.1。

   下载地址：<http://7xooko.com1.z0.glb.clouddn.com/AlipaySDK.zip>

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

   ![](http://7xooko.com1.z0.glb.clouddn.com/QQ20160121-2@2x.png)

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

   ![](http://7xooko.com1.z0.glb.clouddn.com/Snip20160124_5.png)

   参考链接：[iOS App提交指南(二)-协议、税务和银行业务](http://www.jianshu.com/p/c7cf65911bc1)

2. 添加一个用于在sandbox付费的测试用户

   ![](http://7xooko.com1.z0.glb.clouddn.com/Snip20160124_3.png)

   ![](http://7xooko.com1.z0.glb.clouddn.com/Snip20160124_4.png)

3. 用该App ID创建一个新的应用。

4. 创建应用内付费项目，选择付费类型。

   ![](http://7xooko.com1.z0.glb.clouddn.com/QQ20160124-0@2x.png)

   ![](http://7xooko.com1.z0.glb.clouddn.com/QQ20160124-1@2x.png)

   App 内购买项目摘要填写  

   ![](http://7xooko.com1.z0.glb.clouddn.com/Snip20160124_1.png)

   ![](http://7xooko.com1.z0.glb.clouddn.com/Snip20160124_2.png)

#### 主要代码实现

1. 在工程中引入 `StoreKit.framework` 和` #import <StoreKit/StoreKit.h>`

2. 获得所有的付费Product ID列表。这个可以用常量存储在本地，也可以由自己的服务器返回。

   ```
   //在内购项目中创建的商品单号
   #define ProductID_IAP_FTHJ @"com.1000phone.IAPDemo.fthj_purple" // 方天画戟 488元
   #define ProductID_IAP_XYJ @"com.1000phone.IAPDemo.xyj" // 轩辕剑 6,498元
   #define ProductID_IAP_JB @"com.1000phone.IAPDemo.jb" // 金币 6元=6金币
   ```

   ​

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

   ​

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

### 参考资料

1. [官方Pay教程](https://developer.apple.com/apple-pay/)
2. [Apple Pay 中文入门](https://developer.apple.com/apple-pay/get-started/cn/)

##  Pay VS In-App Purchase

|      |                   Pay                   |             In-App Purchase              |
| ---- | :--------------------------------------: | :--------------------------------------: |
| 框架   |                 PassKit                  |                 StoreKit                 |
| 适用范围 | **实体商品**（如食品杂货、服装和电器）和**服务**（如俱乐部会员、酒店预订和活动门票） | **销售虚拟商品**，如适用于您的 App 的优质内容及订阅数字内容；程序内的内容和功能性；程序内货币服务；数码订阅 |
| 支付处理 |               自己的支付平台处理付款                |                 苹果公司处理付款                 |

## 更新日志
- 2016-05-26 添加 Pay 支付
