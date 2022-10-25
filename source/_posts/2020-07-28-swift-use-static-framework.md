title: CocoaPods 快速使用 Swift 静态库
date: 2020-07-28 22:26:12
updated: 2020-07-28 22:26:12
tags:
- CocoaPods
- Swift
- Static Framework
categories: iOS
---

想在项目中使用静态库功能，需要在 Podspec 显示指定 s.static_framework = true，对于多个 Pod 的项目来说，一个个改起来太麻烦了，也不现实。但是 CocoaPods 是 Ruby 写的，我们可以通过 patch CocoaPods 来实现在只写几行代码的情况下，把所有 pod 变成 Static Framework。

通过分析 CocoaPods 的源代码发现，CocoaPods 会通过  Pod -> Installer -> Analyzer -> determine_build_type 这个方法来决定每个 podspec 的 build type，我们可以通过 patch 这个方法来改写。

在 Podfile 的同级目录创建 `patch_static_framework.rb`

```ruby
module Pod
    class Installer
        class Analyzer
            def determine_build_type(spec, target_definition_build_type)
                if target_definition_build_type.framework?
                    # 过滤掉只能动态库方式的framework，或者不确定的framework
                    dynamic_frameworks = ['xxxxx']
                    if !dynamic_frameworks.include?(spec.root.name)
                        return BuildType.static_framework
                    end
                    root_spec = spec.root
                    root_spec.static_framework ? BuildType.static_framework : target_definition_build_type
                else
                    BuildType.static_library
                end
            end
        end
    end
end
```

在 Podfile 的最上面，引入该文件

```ruby
require_relative 'patch_static_framework'
```

这样 patch 就会在 pod install 的时候生效，我们就不需要改每个 Pod 的 Podspec 就可以实现每个 Pod 都是 static_framework。