title: Objective-C 内存管理
tags:
---

## 引用计数内存管理方式

* 自己生成的对象，自己所持有。
* 非自己生成的对象，自己也能持有。
* 不再需要自己持有的对象时释放。
* 非自己持有的对象无法释放。


| 对象操作 | Objective-C 方法 |
| --- | --- |
| 生成并持有对象 | alloc/new/copy/mutableCopy等方法 |
| 持有对象 | retain 方法 |
| 释放对象 | release 方法 |
| 废弃对象 | dealloc 方法 |










