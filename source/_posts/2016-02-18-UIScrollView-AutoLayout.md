title: UIScrollView的子视图实现AutoLayout布局
date: 2016-02-18 09:53:04
updated: 2016-02-18 09:53:04
tags:
- UIScrollView
- AutoLayout
categories: iOS
---
UIScrollView中子视图建立约束不能实现滚动，要实现子视图的AutoLayout布局需要借助UIView来实现。

## 具体实现步骤
1. 添加一个UIView作为UIScrollView的ContentView，之后将之前直接添加到UIScrollView中的子视图添加到ContentView中
![](Snip20160218_2.png)
1. 为ContentView建立6个约束，四条边的约束、高度和宽度的约束。
![](Snip20160218_4.png)
1. 若要实现UIScrollView垂直滚动修改`Equal Height`约束的优先级为Low(250)，若要实现UIScrollView水平滚动修改`Equal Width`约束的优先级为Low(250)
![](Snip20160218_5.png)
1. 将原本添加到UIScrollView中的子视图添加到ContentView，为子视图建立约束
2. 若是垂直滚动，需要为最下方的子视图添加一个`Bottom Space to SuperView`约束；若是水平滚动，需要设置最右方的子视图添加一个`Trailing space to SuperView`约束
![](Snip20160218_6.png)
1. 最终实现在UIScrollView的子视图通过AutoLayout布局实现滚动效果
![](UIScrollViewAutoLayout.gif)

## Demo 下载
<https://github.com/xwal/Demo/tree/master/UIScrollViewAutoLayout>
