title: 命令行工具使用技巧
date: 2016-04-30 22:11:50
tags: Tools
categories: Unix/Linux
---
## 只显示子目录、不显示文件，可以使用下面的命令。
```
# 只显示常规目录
$ ls -d */
$ ls -F | grep /
$ ls -l | grep ^d
$ tree -dL 1

# 只显示隐藏目录
$ ls -d .*/

# 隐藏目录和非隐藏目录都显示
$ find -maxdepth 1 -type d
```
> 来自runyf

## Git常用命令速查表

![](https://dn-coding-net-production-pp.qbox.me/100e4dc6-0317-409f-9ff9-935890315137.jpg)
> 来自Coding

## 清除DNS缓存命令
```
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder
```

## 批量重命名文件

以下命令将文件名中包含`~iphone`的文字替换为空字符

```
for i in `ls`; do mv -f $i `echo $i | sed 's/~iphone//g'`; done
```

## Git 删除 一个 submodule


1. 删除 `.gitmodules` 文件中关联内容；
2. 执行 `git add .gitmodules`
3. 删除 `.git/config` 文件中关联内容；
4. 执行 `git rm --cached path_to_submodule`（不包含尾部斜线）
5. 执行 `rm -rf .git/modules/path_to_submodule`
6. 提交 `git commit -m "Removed submodule <name>"`
7. 删除子模块文件 `rm -rf path_to_submodule`

## Changing remote repository for a git submodule 

You should just be able to edit the **.gitmodules** file to update the URL and then run **git submodule sync** to reflect that change to the superproject and your working copy.

```
git config --file=.gitmodules submodule.Submod.url https://github.com/username/ABC.git
git config --file=.gitmodules submodule.Submod.branch Development
git submodule sync
git submodule update --init --recursive --remote
```

参考链接：<http://stackoverflow.com/questions/913701/changing-remote-repository-for-a-git-submodule>


