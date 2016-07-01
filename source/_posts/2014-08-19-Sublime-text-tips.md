---
layout: post
title: "sublime text 应用技巧"
date: 2014-08-19 20:20:05 +0800
comments: true
categories: Tutorial
tags: Sublime Text
---
## 1. sublime text 3 破解 ##
[破解方法](http://www.xiumu.org/note/sublime-text-3.shtml)  
注册码
```
-----BEGIN LICENSE-----
Admin
Unlimited User License
EA7E-32655
C72EC454F5FA776BE9F72A124581527A
B7933CD63E4B660B67B9DEC5090DE4BF
70BF7D8855B173E857A9C97FC8BE29BA
42437313D9F6B77F893894C0EA9FF9AD
0B3FEFAD80925516E280017A5829696B
B38375067F7FAEAEE09F5CEDB85FCE69
0EB3B9D6899733B6A64E1F64C3E3CCEF
438141D1830F60ACF465EE03C9536300
-----END LICENSE-----
```
## 2. Package Control 简便安装方法 ##
[简便安装方法](https://sublime.wbond.net/installation#st3)  
通过快捷方式`` Ctrl + ` ``或者从菜单 View – Show Console，调出 console，将代码拷进去执行。
Sublime Text 3
```
import urllib.request,os,hashlib; h = '7183a2d3e96f11eeadd761d777e62404' + 'e330c659d4bb41d3bdf022e94cab3cd0'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://sublime.wbond.net/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)
```
Sublime Text 2
```
import urllib2,os,hashlib; h = '7183a2d3e96f11eeadd761d777e62404' + 'e330c659d4bb41d3bdf022e94cab3cd0'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); os.makedirs( ipp ) if not os.path.exists(ipp) else None; urllib2.install_opener( urllib2.build_opener( urllib2.ProxyHandler()) ); by = urllib2.urlopen( 'http://sublime.wbond.net/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); open( os.path.join( ipp, pf), 'wb' ).write(by) if dh == h else None; print('Error validating download (got %s instead of %s), please try manual install' % (dh, h) if dh != h else 'Please restart Sublime Text to finish installation')
```
## 3. 快捷方式 ##
### 命令面板 ###
* `Ctrl + Shift + P` 调出面板，键入需要的命令即可。
* `Ctrl + P`  快速切换文件。  
用 `Ctrl + P` 可以快速跳转到当前项目中的任意文件，可进行关键词匹配。  
用 `Ctrl + P` 后 `@` (或是`Ctrl + R`)可以快速列出/跳转到某个函数（很爽的是在 markdown 当中是匹配到标题，而且还是带缩进的！）。  
用 `Ctrl + P` 后 `#` 可以在当前文件中进行搜索。  
用 `Ctrl + P` 后 `:` (或是`Ctrl+G`)加上数字可以跳转到相应的行。  
而更酷的是你可以用 `Ctrl + P` 加上一些关键词跳转到某个文件同时加上 `@` 来列出/跳转到目标文件中的某个函数，或是同时加上 `#` 来在目标文件中进行搜索，或是同时加上 `:` 和数字来跳转到目标文件中相应的行。

### 文本选择 ###
* `Ctrl + D` 选中一个单词
* `Ctrl + L` 选中一行
* `Ctrl + A` 全选
* `Ctrl + Shift + M` 选中括号内所有内容
* 多选行：按住 Ctrl 键再点击想选中的行
* `Alt + F3` (选中部分文本时) 按此键选中所有相同文本
* `Ctrl + D` (选中部分文本时) 直接选中下一次出现的该文本
* `Ctrl + Shift + L` （选中文本时）多行同时选择
* `Shift + Right mouse button` 也能多行同时选择

## 4. 插件 ##
* File Rename
* Markdown Preview
* Alignment
