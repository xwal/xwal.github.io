title: iOS项目的目录结构和开发流程
date: 2016-01-20 15:23:34
tags:
- 目录结构
- 开发流程
categories: iOS
---

## 目录结构

一个合理的目录结构首先应该是清晰的，让人一眼看上去就能大概了解目录的职责，且容易应对新的变化。

### 常规的两种结构：

1. 主目录按照业务分类，内目录按照模块分类(主目录按照MVC架构分类，内部根据项目模块分类)

   > 优点：相对比较快定位对应的业务。  
   > 缺点：模块相关类太过分散，需要来回切换寻找文件，不方便开发。

   ```
   ├── Application
   ├── Categories
   ├── Controllers
   │   ├── Blog
   │   ├── Comment
   │   ├── Login
   │   ├── News
   |	...
   ├── Models
   │   ├── OSC
   │   └── Team
   ├── Resource
   │   ├── CSS
   │   ├── html
   │   ├── js
   ├── Utils
   ├── Vendor
   └── Views
   ```

2. 主目录按照模块分类，内目录按照业务分类

   > 优点：对模块的类集中化，方便管理与开发。  
   > 缺点：当几个模块共用一些类时，不太好归类。

   ```
   ├── Application
   ├── Categories
   │├── Blog
   |	├── Controller
   |	├── View
   |	├── Model
   ├── Login
   |	├── Controller
   |	├── View
   |	├── Model
   |	....
   ├── Resource
   │   ├── CSS
   │   ├── html
   │   ├── js
   ├── Utils
   ├── Vendor
   ```

<!--more-->

### 常见目录结构

#### Application

这个目录下放的是AppDelegate.h(.m)文件，是整个应用的入口文件，接口文件都可以放在该目录下。

#### Controllers

视图控制器相关类。

```
Controllers
    ├── ActivitiesViewController.h
    ├── ActivitiesViewController.m
    ├── ActivityBasicInfoCell.h
    ├── ActivityBasicInfoCell.m
    ├── ActivityCell.h
    ├── ActivityCell.m
   	...
```

#### Models

这个目录下放一些与数据相关的Model文件。

```
Models
    |- BaseModel.h
    |- BaseModel.m
    |- CollectionModel.h
    |- CollectionModel.m
    ...
```

#### Views

视图，自定义视图，被重用的视图。

```
Views
	├── EditingBar.h
    ├── EditingBar.m
    ├── GrowingTextView.h
    ├── GrowingTextView.m
    ...
```

#### Macros

这个目录下放了整个应用会用到的宏定义。

```
Macro
	|- Macros.h
    |- AppMacro.h
    |- NotificationMacro.h
    |- VendorMacro.h
    |- UtilsMacro.h
    ...
```

AppMacro.h 里放app相关的宏定义，如:

```
// 表情相关
#define EMOTION_CACHE_PATH @"cachedemotions"
#define EMOTION_RECENT_USED @"recentusedemotions"
#define EMOTION_CATEGORIES @"categoryemotions"
#define EMOTION_TOPICS @"emotiontopics"

// 收藏相关
#define COLLECT_CACHE_PATH @"collected"

// 配图相关
#define WATERFALL_ITEM_HEIGHT_MAX 300
#define WATERFALL_ITEM_WIDTH 146
```

NotificationMacro.h 里放的是通知相关的宏定义。

UtilsMacro.h 里放的是一些方便使用的工具宏定义。

```
#define UIColorFromRGB(r,g,b) [UIColor colorWithRed:r/255.0 green:g/255.0 blue:b/255.0 alpha:1]

#define NSStringFromInt(intValue) [NSString stringWithFormat:@"%d",intValue]
```

VendorMacro.h 里放一些第三方常量

```
#define UMENG_KEY @"xxxxx"
#define UMENG_CHANNEL_ID @"xxx"
```

如果有新的类型的宏定义，可以再新建一个相关的Macro.h。

#### Helpers/Utils

这个目录放一些助手类/工具类。自己实现的一些通用性较好的功能代码，这些代码有比较好的接口且与本项目不存在耦合，可直接复用于其他项目。

```
Helpers
    |- TPKShareHelper
    |- TPDBHelper
    |- TPKEmotionHelper
    ...
```

#### Vendors

这个目录放第三方的类库/SDK，如UMeng、WeiboSDK、WeixinSDK等等。

#### Resources

这个目录下放的是app会用到的一些资源文件。

## 开发流程
