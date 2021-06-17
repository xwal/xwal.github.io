title: missing compatible arch in ffi_c.bundle on M1 with system Ruby
date: 2021-06-17 18:24:06
tags:
- CocoaPods
- ruby
categories: iOS
---

解决 Apple Silicon (M1) 上 `LoadError - dlsym(0x7fbb17932d30, Init_ffi_c): symbol not found - /Library/Ruby/Gems/2.6.0/gems/ffi-1.15.3/lib/ffi_c.bundle` 问题。


首先通过 `file /Library/Ruby/Gems/2.6.0/gems/ffi-1.15.3/lib/ffi_c.bundle` 查看这个文件的架构：

```
/Library/Ruby/Gems/2.6.0/gems/ffi-1.15.3/lib/ffi_c.bundle: Mach-O universal binary with 2 architectures: [x86_64:Mach-O 64-bit bundle x86_64] [arm64e:Mach-O 64-bit bundle arm64e]
/Library/Ruby/Gems/2.6.0/gems/ffi-1.15.3/lib/ffi_c.bundle (for architecture x86_64):	Mach-O 64-bit bundle x86_64
/Library/Ruby/Gems/2.6.0/gems/ffi-1.15.3/lib/ffi_c.bundle (for architecture arm64e):	Mach-O 64-bit bundle arm64e
```

上面的信息有x86_64和arm64e，虽然包含了arm64e，但是此arm64e不是M1 对应的arm64。也就是说架构是不对的。

那我们接着往下看，先查询下系统ruby的版本 `ruby --version`。

```
ruby 2.6.3p62 (2019-04-16 revision 67580) [universal.arm64e-darwin20]
```

版本和时间都有，2019-04-16 的版本，但是 M1 是 2020 年出来的，不一定适配了新的架构。

那我们就必须得确认当前ruby的真实架构。我们可以通过一段代码获取 `arch.rb`：

```ruby
require 'rbconfig'

OSVERSION = RbConfig::CONFIG['host_os']
CPU = RbConfig::CONFIG['host_cpu']
ARCH = RbConfig::CONFIG['arch']

puts "OS: #{OSVERSION}"
puts "CPU: #{CPU}"
puts "Arch: #{ARCH}"
```   

输出结果：

```
OS: darwin20
CPU: x86_64
Arch: universal-darwin20
```

诡异的一幕出现了，CPU架构却是x86_64而不是arm64，也就是说造成ffi无法运行的原因是ruby版本不支持 arm64。

问题找到了那接下来这个问题就好解决了，安装最新的ruby版本。

可以通过 `brew install ruby`，也可以通过 rbenv 或者 rvm 来安装。

我使用 `brew install ruby` 来安装最新的版本。

通过 brew 安装的 ruby 并不会生效，需要添加到环境变量中 `echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc`。

为了验证是否有效我们先测试下新版本的架构，先设置当前shell的环境变量 `export PATH="/opt/homebrew/opt/ruby/bin:$PATH"`。

执行 `ruby --version`：

```
ruby 3.0.1p64 (2021-04-05 revision 0fb782ee38) [arm64-darwin20]
```

执行 `ruby arch.rb`：

```
OS: darwin20
CPU: arm64
Arch: arm64-darwin20
```

CPU 架构正确，继续安装 CocoaPods `gem install cocoapods`。

成功！！！