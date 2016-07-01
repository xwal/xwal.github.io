title: iOS 清单
date: 2016-03-18 10:06:55
tags: Checklist
categories: iOS
---

## iOS代码签入前检查清单

| **iOS Pre-Check-in Checklist**           | **Yes/No** |
| ---------------------------------------- | ---------- |
| Have I regression tested everything in Instruments for leaks and abandoned memory? |            |
| Have I ran all automated UI tests and verified there are no crash bugs? |            |
| Have I ran all unit tests to insure I haven't broken anything? |            |
| Did I do a compare of all the code to make sure all code is code review ready? |            |
| Have all new files been added into source control? |            |
| Have all work items been updated and ready to associate with the check-in? |            |
| Have I removed all code I commented out that no longer needs to be there? |            |
| Have I written clean code comments?      |            |
| Is there anything I hacked together quickly to get it to work but needs to be cleaned up? |            |
| Is there duplicate code that I could simplify into 1 location? |            |
| Is there debug code that needs to be removed or commented out? |            |
| Is all text localized for all supported languages? |            |
| Are all images provided by the graphic designer checked in? |            |
| Are there any warnings in the checked-out files that can be addressed in this check-in? |            |
| Are there new dev target/environment settings that I forgot to also add to the production target/environment? |            |

1. 是否在Instruments中对内存泄露进行了回归测试？

   > Have I regression tested everything in Instruments for leaks and abandoned memory?
2. 是否运行了所有的UI测试同时确认没有crash bugs？

   > Have I ran all automated UI tests and verified there are no crash bugs?
3. 是否运行了所有的单元测试确保没有造成破坏？

   > Have I ran all unit tests to insure I haven't broken anything?
4. 是否进行了所有代码比较确保所有代码审查准备好了？

   > Did I do a compare of all the code to make sure all code is code review ready?
5. 是否所有新文件都添加到源代码管理中？
   > Have all new files been added into source control?
6. 是否所有工作项已经被更新并准备签入？

   > Have all work items been updated and ready to associate with the check-in?
7. 是否移除了已经注释过不再使用的代码？

   > Have I removed all code I commented out that no longer needs to be there?
8. 是否写了清晰的代码注释？

   > Have I written clean code comments?
9. 是否有某个功能是仅仅为了让程序能迅速运行但是需要清除的(比如某段没有设计过的功能代码)？

   > Is there anything I hacked together quickly to get it to work but needs to be cleaned up?
10. 是否有可以简化的重复代码？

    > Is there duplicate code that I could simplify into 1 location?
11. 是否有需要移除或者注释掉的调试代码？

    > Is there debug code that needs to be removed or commented out?
12. 是否所有支持多语言的文本都已经本地化？

    > Is all text localized for all supported languages?
13. 是否由图形设计师提供的图片都已经签入？

    > Are all images provided by the graphic designer checked in?
14. 是否在本次签入代码之前能够解决检出代码的警告？

    > Are there any warnings in the checked-out files that can be addressed in this check-in?​
15. 是否有新的开发的target/environment设置忘了添加到生产的 target/environment？
    > Are there new dev target/environment settings that I forgot to also add to the production target/environment?

## iOS 测试清单

| **Final Sanity Checks**       | **Appearance** | **Functionality** |
| ----------------------------- | -------------- | ----------------- |
| Localized?                    | YES            | NO                |
| Portrait/Landscape?           |                |                   |
| Empty Data Source?            |                |                   |
| Large Data Source?            |                |                   |
| CRUD?                         |                |                   |
| All modes/perspectives?       |                |                   |
| Different Entry/Exit points?  |                |                   |
| Different User Settings?      |                |                   |
| Without internet connection?  |                |                   |
| iPhone & iPad? (if Universal) |                |                   |
| New Install?                  |                |                   |
| Different version of iOS?     |                |                   |
