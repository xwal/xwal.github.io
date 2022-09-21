title: 记录一次优化 Xcode 编译的过程
tags:
  - Xcode
categories: iOS
date: 2020-04-20 09:48:18
---

接触新项目后，发现没有改代码的情况下，每次编译基本上编译时间都在一分钟左右。就有了一个想法去解决这个问题，断断续续花了三天时间解决，解决过程中，学习到很多，记录下来。

## 0x01 发现问题

### 开启编译耗时显示

打开终端执行以下命令并重启Xcode：

```shell
$ defaults write com.apple.dt.Xcode ShowBuildOperationDuration -bool YES
```

### 编译 Build

编译时长 56.3 s，其中耗时比较长的过程为以下：

-  **Compile asset catalogs**：23.5 s
- **[CP]Embed Pods Frameworks**：7.4 s
- **[CP] Copy Pods Resources**：17.6 s

## 0x02 分析&解决问题

### 开始尝试优化 Xcode 编译速度

发现编译耗时集中在上面三个过程中，一开始主要关注于 Xcode 本身编译提升，看了很多关于提升 Xcode 编译速度的文章，比如这篇文章：<https://elliotsomething.github.io/2018/05/23/XCodeBuild/>

#### 编译时长优化 Find Implicit Dependencies

对所编译项目的Scheme进行配置 Product > Scheme > Edit Scheme > Build Build Opitions选项中，去掉Find Implicit Dependencies。

#### 编译线程数优化

```shell
$ defaults write com.apple.dt.xcodebuild PBXNumberOfParallelBuildSubtasks `sysctl -n hw.ncpu`
$ defaults write com.apple.dt.xcodebuild IDEBuildOperationMaxNumberOfConcurrentCompileTasks `sysctl -n hw.ncpu`
$ defaults write com.apple.dt.Xcode PBXNumberOfParallelBuildSubtasks `sysctl -n hw.ncpu`
$ defaults write com.apple.dt.Xcode IDEBuildOperationMaxNumberOfConcurrentCompileTasks `sysctl -n hw.ncpu`
```

其后的数字为指定的编译线程数。Xcode默认使用与CPU核数相同的线程来进行编译，但由于编译过程中的IO操作往往比CPU运算要多，因此适当的提升线程数可以在一定程度上加快编译速度。

然后做完以上尝试后，优化了4s。😭

远远没有达到优化的目的。

### 寻找另外的解决方向

从 Xcode 的本身优化不能有任何的提升后，那问题只能出在工程本身，再次分析编译过程的时长发现和 Assets.xcassets 和 Pods 关系很大。先从 CocoaPods 开始分析 Podfile，发现工程的 Podfile 有如下代码：

> install! 'cocoapods', disable_input_output_paths: true

去掉以后运行 `pod install`，出现编译出现错误：

> error: Multiple commands produce '/xxxxx/xxxxx/Assets.car':
>
> 1) Target 'xxxx' (project 'xxx') has compile command with input '/xxxx/xxxx/Assets.xcassets'
>
> 2) That command depends on command in Target 'xxx' (project 'xxx'): script phase “[CP] Copy Pods Resources”

在 CocoaPods 上找到了这样一个 issue  <https://github.com/CocoaPods/CocoaPods/issues/8122>，里面提到主工程里 Assets.xcassets 和 Pods 里有同名的  Assets.xcassets，在 Xcode 10 之前进行编译是不会有问题的，Xcode 只是生成 Warning，但是在 Xcode 10 之后使用了 New Build System 会生成 Errror，提示重复生成 Assets.car。

issue 里提到了4种解决方案：

方案1：<https://github.com/CocoaPods/CocoaPods/issues/8122#issuecomment-424169508>

```
install! 'cocoapods', :disable_input_output_paths => true
```

这个方案会导致每次编译时长增加3x倍多。这也刚好是我们工程采用的方式。

方案2：https://github.com/CocoaPods/CocoaPods/issues/8122#issuecomment-424265887

 使用  `Legacy Build System`  而不是 Xcode 11 的 `New Build System`。

方案3：在 Podfile 中添加如下代码

```ruby
project_path = '[YOUR_PROJ_NAME].xcodeproj'
project = Xcodeproj::Project.open(project_path)
project.targets.each do |target|
  build_phase = target.build_phases.find { |bp| bp.display_name == '[CP] Copy Pods Resources' }

  assets_path = '${TARGET_BUILD_DIR}/${UNLOCALIZED_RESOURCES_FOLDER_PATH}/Assets.car'
  if build_phase.present? && build_phase.input_paths.include?(assets_path) == false
    build_phase.input_paths.push(assets_path)
  end
end
```

这种方案在 CocoaPods 1.8.0 之前可以的，但是在 1.8.0 之后 Input Files 变成了 xcfilelist，就无法直接使用了。

方案4：<https://github.com/CocoaPods/CocoaPods/issues/8122#issuecomment-531726302>

主要代码是在 `[CP] Copy Pods Resources`的 `Input Files ` 或者 `Input File Lists ` 中添加。

```
$ {TARGET_BUILD_DIR}/${UNLOCALIZED_RESOURCES_FOLDER_PATH}/Assets.car
```

尝试了以上4种解决方案，只有方案4 符合预期。

## 0x03 解决方案

使用这个 cocoapods 插件：<https://github.com/dreampiggy/cocoapods-xcode-patch>

使用 [Bundler](https://bundler.io/) 和 [Gemfile](https://bundler.io/gemfile.html) 添加这个插件：

```
source "https://rubygems.org"

gem 'cocoapods'
gem 'cocoapods-xcode-patch', :git => 'https://github.com/dreampiggy/cocoapods-xcode-patch.git'
```

使用  `bundle exec pod install` 替代 `pod install` 来加载这个插件。

## 0x04 原因分析

出现这个问题根本原因是因为 CocoaPods 有两种资源管理方式 `resource_bundles`  和 `resources` 。

以下简单介绍下这两种资源管理方式：

### resource_bundles（官方推荐）

> This attribute allows to define the name and the file of the resource bundles which should be built for the Pod. They are specified as a hash where the keys represent the name of the bundles and the values the file patterns that they should include.
>
> For building the Pod as a static library, we strongly **recommend** library developers to adopt resource bundles as there can be name collisions using the resources attribute.
>
> The names of the bundles should at least include the name of the Pod to minimise the chance of name collisions.
>
> To provide different resources per platform namespaced bundles *must* be used.

#### Examples:

```
spec.ios.resource_bundle = { 'MapBox' => 'MapView/Map/Resources/*.png' }
```

```
spec.resource_bundles = {
    'MapBox' => ['MapView/Map/Resources/*.png'],
    'MapBoxOtherResources' => ['MapView/Map/OtherResources/*.png']
  }
```

### resources

> A list of resources that should be copied into the target bundle.
>
> For building the Pod as a static library, we strongly **recommend** library developers to adopt [resource bundles](https://guides.cocoapods.org/syntax/podspec.html#resource_bundles) as there can be name collisions using the resources attribute. Moreover, resources specified with this attribute are copied directly to the client target and therefore they are not optimised by Xcode.

#### Examples:

```
spec.resource = 'Resources/HockeySDK.bundle'
```

```
spec.resources = ['Images/*.png', 'Sounds/*']
```

由于组件化的原因，我们的某个组件采用了`Assets.xcassets` 和 Storyboard 需要拷贝到主工程中进行引用，Pod 库只能以 `resources` 的方式引用资源。经过这次优化编译速度有了很大提升。

## 0x05 后续：Pods 文件更改没有更新

优化了 Xcode 编译后，出现另外一个问题：更改 Pods 库后，Pods 库已编译但主工程没有使用最新的frameworks，导致动态链接的时候找不到对应的符号而产生崩溃。

导致这个问题的原因是 `Build Phases` 中的 `[CP] Embed Pods Frameworks` 不是每次都执行，猜测可能是 Xcode 11 的 `New Build System` 做了优化，导致脚本没有执行。最终想了个办法来解决这个问题，追加命令来执行脚本 `find "${PODS_ROOT}" -type f -name *frameworks.sh -exec bash -c "touch \"{}\"" \;`，使得脚本每次能执行更新frameworks。

因为 `[CP] Embed Pods Frameworks`的脚本是由 CocoaPods 进行修改的，所有我将上面的命令通过hook的方式来追加，具体使用方法可以查看 <https://github.com/xwal/cocoapods-xcode-patch>。

编译时间也有所增加，在工程中测试大概增加了20s左右，还有优化的空间，后续如果想到更好的解决办法再更新。

## 0x06 参考链接

- <https://elliotsomething.github.io/2018/05/23/XCodeBuild/>
- <https://github.com/CocoaPods/CocoaPods/issues/8122>

- <https://guides.cocoapods.org/syntax/podspec.html#resource_bundles>

