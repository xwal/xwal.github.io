title: 使用 R 进行数据分析
date: 2016-11-07 12:42:41
updated: 2016-11-07 12:42:41
tags:
- R
categories: 数据分析
---

## macOS 上搭建 R 开发环境

R 语言官方网站：<https://www.r-project.org>

RStudio 官方网站：<https://www.rstudio.com>

RStudio 是 R 语言的IDE。

### 安装包安装

1. 安装 XQuartz

   下载地址：<https://www.xquartz.org>

2. 安装 R

   下载地址：<https://cran.r-project.org>

3. 安装 RStudio

   下载地址：<https://www.rstudio.com/products/rstudio/download/>

### 命令行安装

1. 安装 Homebrew

   ```
   /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
   brew tap caskroom/cask
   brew install brew-cask
   brew update && brew upgrade brew-cask && brew cleanup && brew cask cleanup
   ```

2. 安装 R 开发工具

   ```
   brew cask install xquartz
   brew tap homebrew/science
   brew install R
   brew cask install rstudio
   ```

   ​

