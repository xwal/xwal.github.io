title: Fastlane 实践（一）：自动化打包和发布
tags:
- fastlane
- CI
categories: iOS
---
![](https://docs.fastlane.tools/img/fastlane_text.png)
> fastlane is the easiest way to automate beta deployments and releases for your iOS and Android apps. 🚀 It handles all tedious tasks, like generating screenshots, dealing with code signing, and releasing your application.

fastlane 是自动化Beta部署和发布iOS和Android应用程序最简单方法。它可以处理所有繁琐的任务，例如生成屏幕截图，处理代码签名以及发布应用程序。

## Fastlane 安装

### 安装 Xcode command line tools
```shell
$ xcode-select --install
```

### 安装 Homebrew
```shell
$ /usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

### 安装 RVM

```shell
$ curl -sSL https://get.rvm.io | bash -s stable --auto-dotfiles
$ source ~/.rvm/scripts/rvm
```

修改 RVM 的 Ruby 安装源到 Ruby China 的 Ruby 镜像服务器，这样能提高安装速度。

```shell
$ echo "ruby_url=https://cache.ruby-china.org/pub/ruby" > ~/.rvm/user/db
```

#### 安装Ruby 2.6.5

```shell
$ rvm install 2.6.5
$ rvm use 2.6.5 --default
```

#### 更新 RubyGems 镜像

```shell
$ gem sources --add https://gems.ruby-china.org/ --remove https://rubygems.org/
$ gem sources -l
https://gems.ruby-china.org
# 确保只有 gems.ruby-china.org
bundle config mirror.https://rubygems.org https://gems.ruby-china.org
```

#### 安装 CocoaPods 和 Fastlane

```shell
$ gem install cocoapods
$ gem install fastlane -NV
$ gem install bundle
```

## 快速开始

1. 进入 iOS App 的目录并运行：

    ```shell
    fastlane init
    ```
    
    fastlane 会自动自动识别你的项目，并询问任何缺失的信息。
    
2. [fastlane Getting Started guide for iOS](https://docs.fastlane.tools/getting-started/ios/setup/)

3. [fastlane Getting Started guide for Android](https://docs.fastlane.tools/getting-started/android/setup/)

## Fastlane 进阶用法

随着公司项目的增多，每次都运行重复的Fastlane 命令进行配置会低效很多，所以急需一套可以满足所有App需求的配置。

Fastlane 是由Ruby开发，所以也支持 dotenv 的功能。

最终Fastlane生成目录结构如下：

> ├── .env
├── Appfile
├── Deliverfile
├── Fastfile
├── Matchfile
├── Pluginfile
├── README.md
├── Scanfile
├── metadata
│   ├── app_icon.jpg
│   ├── copyright.txt
│   ├── primary_category.txt
│   ├── primary_first_sub_category.txt
│   ├── primary_second_sub_category.txt
│   ├── review_information
│   │   ├── demo_password.txt
│   │   ├── demo_user.txt
│   │   ├── email_address.txt
│   │   ├── first_name.txt
│   │   ├── last_name.txt
│   │   ├── notes.txt
│   │   └── phone_number.txt
│   ├── secondary_category.txt
│   ├── secondary_first_sub_category.txt
│   ├── secondary_second_sub_category.txt
│   ├── trade_representative_contact_information
│   │   ├── address_line1.txt
│   │   ├── address_line2.txt
│   │   ├── address_line3.txt
│   │   ├── city_name.txt
│   │   ├── country.txt
│   │   ├── email_address.txt
│   │   ├── first_name.txt
│   │   ├── is_displayed_on_app_store.txt
│   │   ├── last_name.txt
│   │   ├── phone_number.txt
│   │   ├── postal_code.txt
│   │   ├── state.txt
│   │   └── trade_name.txt
│   └── zh-Hans
│       ├── apple_tv_privacy_policy.txt
│       ├── description.txt
│       ├── keywords.txt
│       ├── marketing_url.txt
│       ├── name.txt
│       ├── privacy_url.txt
│       ├── promotional_text.txt
│       ├── release_notes.txt
│       ├── subtitle.txt
│       └── support_url.txt
└── pem
    ├── development_xxx.xxx.xxx.p12
    ├── development_xxx.xxx.xxx.pem
    ├── development_xxx.xxx.xxx.pkey
    ├── production_xxx.xxx.xxx.p12
    ├── production_xxx.xxx.xxx.pem
    ├── production_xxx.xxx.xxx.pkey

### .env

这个文件中放入的是需要引用的环境变量。

```ruby
FASTLANE_SKIP_UPDATE_CHECK=true
FASTLANE_XCODEBUILD_SETTINGS_TIMEOUT=120

APPLE_ID="xxxx"	# Apple ID 账号
TEAM_ID="xxxx"	# Apple Team ID
FASTLANE_PASSWORD="xxx"	# Apple ID 密码
FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD="qwwe-tdpp-hdpc-fgzy" # Apple 应用程序特定密码，Apple ID 现在强制开启两步验证后，此密码是必须的
ITC_TEAM_ID="xxxx"	# iTunes Connect Team ID

APP_IDENTIFIER="xxx.xxx.xxx"
SCHEME_NAME="XXX"
WORKSPACE_NAME="XXX.xcworkspace"
XCODEPROJ_NAME="XXX.xcodeproj"

# 测试环境
DEV_APP_IDENTIFIER="xxx.xxx.dev.xxx"
DEV_APP_NAME="XXX测试版"

# 正式环境
PROD_APP_IDENTIFIER="xxx.xxx.xxx"
PROD_APP_NAME="XXX"

MATCH_GIT_BRANCH="XXX"

DELIVER_METADATA_PATH="./fastlane/metadata"
DOWNLOAD_METADATA_PATH="./metadata"
```

### Appfile

```ruby
app_identifier "#{ENV["APP_IDENTIFIER"]}" # The bundle identifier of your app
apple_id "#{ENV["APPLE_ID"]}" # Your Apple email address

team_id "#{ENV["TEAM_ID"]}" # Developer Portal Team ID
itc_team_id "#{ENV["ITC_TEAM_ID"]}" # App Store Connect Team ID

# you can even provide different app identifiers, Apple IDs and team names per lane:
# More information: https://github.com/fastlane/fastlane/blob/master/fastlane/docs/Appfile.md

```

### Deliverfile

```ruby
###################### More Options ######################
# If you want to have even more control, check out the documentation
# https://docs.fastlane.tools/actions/deliver


###################### Automatically generated ######################
# Feel free to remove the following line if you use fastlane (which you should)

app_identifier "#{ENV["APP_IDENTIFIER"]}" # The bundle identifier of your app
username "#{ENV["APPLE_ID"]}" # your Apple ID user

```

### Fastfile

```ruby
# Customise this file, documentation can be found here:
# https://docs.fastlane.tools/actions/
# All available actions: https://docs.fastlane.tools/actions
# can also be listed using the `fastlane actions` command

# Change the syntax highlighting to Ruby
# All lines starting with a # are ignored when running `fastlane`

# If you want to automatically update fastlane if a new version is available:
# update_fastlane

# This is the minimum version number required.
# Update this, if you use features of a newer version
fastlane_require "spaceship"

fastlane_version "2.89.0"

default_platform :ios

platform :ios do

  base_path = Pathname::new(File::dirname(__FILE__)).realpath.parent

  before_all do
    # ENV["SLACK_URL"] = "https://hooks.slack.com/services/..."
    # cocoapods
    # carthage
  end

  desc "生成 adhoc 测试版本，提交到蒲公英，参数 => type:'adhoc/development'，默认adhoc"
  lane :pgyer_beta do |options|

    type = String(options[:type] || "adhoc")

    if type == "adhoc"
      export_method = "ad-hoc"
      match_type = "adhoc"
      match_type_name = "AdHoc"
    else
      export_method = "development"
      match_type = "development"
      match_type_name = "Development"
    end

    git_reversion = sh("git log -1 --pretty=format:'%h'")
    version_number = get_info_plist_value(path: "#{ENV["SCHEME_NAME"]}/Info.plist", key: "CFBundleShortVersionString")
    build_number = number_of_commits(all: false)

    # git log
    git_log = sh("git log --no-merges -1 --pretty=format:'# %ai%n# %B by %an'")
    build_time = Time.new.strftime("%Y-%m-%d_%H.%M.%S")

    # 输出目录
    output_dir = "#{base_path}/Output/adhoc/#{build_time}"
    output_name = "#{ENV["SCHEME_NAME"]}_v#{version_number}(#{build_number}).ipa"

    # 更新badge
    add_badge(shield: "#{version_number}-#{build_number}-orange")

    # 更新 build number
    increment_build_number(build_number: build_number)

    # 更新 product bundle identifier
    update_app_identifier(
      xcodeproj: "#{ENV["XCODEPROJ_NAME"]}",
      plist_path: "#{ENV["SCHEME_NAME"]}/Info.plist",
      app_identifier: "#{ENV["DEV_APP_IDENTIFIER"]}"
    )
    # 更新display名称，PS: 不能用来更新bundle identifier
    update_info_plist(
      xcodeproj: "#{ENV["XCODEPROJ_NAME"]}",
      plist_path: "#{ENV["SCHEME_NAME"]}/Info.plist",
      block: proc do |plist|
        plist["CFBundleDisplayName"] = "#{ENV["DEV_APP_NAME"]}"
        plist["CFBundleName"] = "#{ENV["DEV_APP_NAME"]}"
        plist["GIT_REVISION"] = git_reversion
        plist["BUILD_TIME"] = build_time
        plist["APP_CHANNEL"] = "pgyer"
        urlScheme = plist["CFBundleURLTypes"].find{|scheme| scheme["CFBundleURLName"] == "weixin"}
        urlScheme[:CFBundleURLSchemes] = ["#{ENV["DEV_WEIXIN_APPID"]}"]
      end
    )

    # 更新Notification Service Extension plist
    update_app_identifier(
      xcodeproj: "#{ENV["XCODEPROJ_NAME"]}",
      plist_path: "#{ENV["NOTIFICATIONSERVICE_SCHEME_NAME"]}/Info.plist",
      app_identifier: "#{ENV["DEV_NOTIFICATION_SERVICE"]}"
    )

    match(
      type: "#{match_type}", 
      app_identifier: ["#{ENV["DEV_APP_IDENTIFIER"]}", "#{ENV["DEV_NOTIFICATION_SERVICE"]}"], 
      readonly: true
    )

    gym(
      export_method: "#{export_method}",
      include_bitcode: false,
      scheme: "#{ENV["SCHEME_NAME"]}", 
      configuration: "AdHoc",
      export_options: {
        compileBitcode: false,
        uploadBitcode: false,
        provisioningProfiles: {
          "#{ENV["DEV_APP_IDENTIFIER"]}" => "match #{match_type_name} #{ENV["DEV_APP_IDENTIFIER"]}",
          "#{ENV["DEV_NOTIFICATION_SERVICE"]}" => "match #{match_type_name} #{ENV["DEV_NOTIFICATION_SERVICE"]}"
        }
      },
      output_directory: output_dir,
      output_name: output_name
    )
    # pilot
    upload_ipa(type: 'gxm', log: git_log)

    # 上传 dsym 文件到 bugly
    bugly(app_id: "#{ENV["DEV_BUGLY_APPID"]}",
      app_key:"#{ENV["DEV_BUGLY_APPKEY"]}",
      symbol_type: 2,
      bundle_id: "#{ENV["DEV_APP_IDENTIFIER"]}",
      product_version: "#{version_number}(#{build_number})",
      channel: 'pgyer'
    )

    copy_dsym(tpye: 'adhoc')
  end

  desc "生成 adhoc 预发版本，提交到蒲公英"
  lane :pgyer_release do

    git_reversion = sh("git log -1 --pretty=format:'%h'")
    build_time = Time.new.strftime("%Y-%m-%d_%H.%M.%S")
    version_number = get_info_plist_value(path: "#{ENV["SCHEME_NAME"]}/Info.plist", key: "CFBundleShortVersionString")
    build_number = number_of_commits(all: false)
    git_log = sh("git log --no-merges -1 --pretty=format:'# %ai%n# %B by %an'")

    # 输出目录
    output_dir = "#{base_path}/Output/release/#{build_time}"
    output_name = "#{ENV["SCHEME_NAME"]}_v#{version_number}(#{build_number}).ipa"

    # 更新badge
    add_badge(shield: "#{version_number}-#{build_number}-orange", alpha: true)

    # 更新 build number
    increment_build_number(build_number: build_number)

    update_app_identifier(
      xcodeproj: "#{ENV["XCODEPROJ_NAME"]}",
      plist_path: "#{ENV["SCHEME_NAME"]}/Info.plist",
      app_identifier: "#{ENV["PROD_APP_IDENTIFIER"]}"
    )

    update_info_plist(
      xcodeproj: "#{ENV["XCODEPROJ_NAME"]}",
      plist_path: "#{ENV["SCHEME_NAME"]}/Info.plist",
      block: proc do |plist|
        plist["CFBundleDisplayName"] = "#{ENV["PROD_APP_NAME"]}"
        plist["CFBundleName"] = "#{ENV["PROD_APP_NAME"]}"
        plist["GIT_REVISION"] = git_reversion
        plist["BUILD_TIME"] = build_time
        plist["APP_CHANNEL"] = "pgyer"
        urlScheme = plist["CFBundleURLTypes"].find{|scheme| scheme["CFBundleURLName"] == "weixin"}
        urlScheme[:CFBundleURLSchemes] = ["#{ENV["PROD_WEIXIN_APPID"]}"]
      end
    )

    # 更新Notification Service Extension plist
    update_app_identifier(
      xcodeproj: "#{ENV["XCODEPROJ_NAME"]}",
      plist_path: "#{ENV["NOTIFICATIONSERVICE_SCHEME_NAME"]}/Info.plist",
      app_identifier: "#{ENV["PROD_NOTIFICATION_SERVICE"]}"
    )

    match(
      type: "adhoc", 
      app_identifier: ["#{ENV["PROD_APP_IDENTIFIER"]}", "#{ENV["PROD_NOTIFICATION_SERVICE"]}"], 
      readonly: true
    )

    update_project_provisioning(
      xcodeproj: "#{ENV["XCODEPROJ_NAME"]}",
      target_filter: "#{ENV["SCHEME_NAME"]}",
      profile:ENV["sigh_#{ENV["PROD_APP_IDENTIFIER"]}_adhoc_profile-path"],
      build_configuration: "Release"
    )

    update_project_provisioning(
      xcodeproj: "#{ENV["XCODEPROJ_NAME"]}",
      target_filter: "#{ENV["NOTIFICATIONSERVICE_SCHEME_NAME"]}",
      profile:ENV["sigh_#{ENV["PROD_NOTIFICATION_SERVICE"]}_adhoc_profile-path"],
      build_configuration: "Release"
    )

    gym(
      export_method: "ad-hoc", 
      scheme: "#{ENV["SCHEME_NAME"]}", 
      configuration: "Release",
      export_options: {
        compileBitcode: false,
        uploadBitcode: false,
        provisioningProfiles: {
          "#{ENV["PROD_APP_IDENTIFIER"]}" => "match AdHoc #{ENV["PROD_APP_IDENTIFIER"]}",
          "#{ENV["PROD_NOTIFICATION_SERVICE"]}" => "match AdHoc #{ENV["PROD_NOTIFICATION_SERVICE"]}"
        }
      },
      output_directory: output_dir,
      output_name: output_name
    )
    # pilot
    
    # 上传蒲公英
    upload_ipa(type: 'gxm', log: "App Store 包上传：#{version_number}(#{build_number})")

    # 上传 dsym 文件到 bugly
    bugly(app_id: "#{ENV["PROD_BUGLY_APPID"]}",
      app_key:"#{ENV["PROD_BUGLY_APPKEY"]}",
      symbol_type: 2,
      bundle_id: "#{ENV["PROD_APP_IDENTIFIER"]}",
      product_version: "#{version_number}(#{build_number})",
      channel: 'pgyer'
    )

    copy_dsym(tpye: 'release')
  end

  desc "生成 appstore 版本，发布到 App Store"
  lane :appstore_release do

    git_reversion = sh("git log -1 --pretty=format:'%h'")
    build_time = Time.new.strftime("%Y-%m-%d_%H.%M.%S")
    version_number = get_info_plist_value(path: "#{ENV["SCHEME_NAME"]}/Info.plist", key: "CFBundleShortVersionString")
    build_number = number_of_commits(all: false)

    # 输出目录
    output_dir = "#{base_path}/Output/appstore/#{build_time}"
    output_name = "#{ENV["SCHEME_NAME"]}_v#{version_number}(#{build_number}).ipa"

    clear_derived_data

    # 更新 build number
    increment_build_number(build_number: build_number)

    update_app_identifier(
      xcodeproj: "#{ENV["XCODEPROJ_NAME"]}",
      plist_path: "#{ENV["SCHEME_NAME"]}/Info.plist",
      app_identifier: "#{ENV["PROD_APP_IDENTIFIER"]}"
    )

    update_info_plist(
      xcodeproj: "#{ENV["XCODEPROJ_NAME"]}",
      plist_path: "#{ENV["SCHEME_NAME"]}/Info.plist",
      block: proc do |plist|
        plist["CFBundleDisplayName"] = "#{ENV["PROD_APP_NAME"]}"
        plist["CFBundleName"] = "#{ENV["PROD_APP_NAME"]}"
        plist["GIT_REVISION"] = git_reversion
        plist["BUILD_TIME"] = build_time
        plist["APP_CHANNEL"] = "appstore"
        urlScheme = plist["CFBundleURLTypes"].find{|scheme| scheme["CFBundleURLName"] == "weixin"}
        urlScheme[:CFBundleURLSchemes] = ["#{ENV["PROD_WEIXIN_APPID"]}"]
      end
    )

    # 更新Notification Service Extension plist
    update_app_identifier(
      xcodeproj: "#{ENV["XCODEPROJ_NAME"]}",
      plist_path: "#{ENV["NOTIFICATIONSERVICE_SCHEME_NAME"]}/Info.plist",
      app_identifier: "#{ENV["PROD_NOTIFICATION_SERVICE"]}"
    )

    match(
      type: "appstore", 
      app_identifier: ["#{ENV["PROD_APP_IDENTIFIER"]}", "#{ENV["PROD_NOTIFICATION_SERVICE"]}"], 
      readonly: true
    )

    update_project_provisioning(
      xcodeproj: "#{ENV["XCODEPROJ_NAME"]}",
      target_filter: "#{ENV["SCHEME_NAME"]}",
      profile:ENV["sigh_#{ENV["PROD_APP_IDENTIFIER"]}_appstore_profile-path"],
      build_configuration: "AppStore"
    )

    update_project_provisioning(
      xcodeproj: "#{ENV["XCODEPROJ_NAME"]}",
      target_filter: "#{ENV["NOTIFICATIONSERVICE_SCHEME_NAME"]}",
      profile:ENV["sigh_#{ENV["PROD_NOTIFICATION_SERVICE"]}_appstore_profile-path"],
      build_configuration: "AppStore"
    )

    # snapshot

    gym(
      export_method: "app-store", 
      scheme: "#{ENV["SCHEME_NAME"]}", 
      configuration: "AppStore",
      export_options: {
        provisioningProfiles: {
          "#{ENV["PROD_APP_IDENTIFIER"]}" => "match AppStore #{ENV["PROD_APP_IDENTIFIER"]}",
          "#{ENV["PROD_NOTIFICATION_SERVICE"]}" => "match AppStore #{ENV["PROD_NOTIFICATION_SERVICE"]}"
        }
      },
      output_directory: output_dir,
      output_name: output_name
    )

    # 上传 dsym 文件到 bugly
    bugly(app_id: "#{ENV["PROD_BUGLY_APPID"]}",
      app_key:"#{ENV["PROD_BUGLY_APPKEY"]}",
      symbol_type: 2,
      bundle_id: "#{ENV["PROD_APP_IDENTIFIER"]}",
      product_version: "#{version_number}(#{build_number})",
      channel: 'appstore'
    )

    # 上传蒲公英
    upload_ipa(type: 'gxm', log: "App Store 包上传：#{version_number}(#{build_number})")

    copy_dsym(type: 'appstore')

    deliver(
      metadata_path: "#{ENV["DELIVER_METADATA_PATH"]}",
      force: true
    )
    # frameit
  end

  desc "上传 AppStore DSYM 文件到 Bugly，参数 => version:[latest]"
  lane :upload_appstore_dsyms do |options|
    version = String(options[:version] || "latest")
    download_dsyms(version: version)
    dsym_paths = lane_context[SharedValues::DSYM_PATHS]
    for dsym_path in dsym_paths
      # 解析DSYM文件版本
      split_strs = dsym_path.split(/\//).last.split(/-/)
      version_number = split_strs[1]
      build_number = split_strs[2].split(/\./)[0]
      # 上传 dsym 文件到 bugly
      bugly(app_id: "#{ENV["PROD_BUGLY_APPID"]}",
        app_key:"#{ENV["PROD_BUGLY_APPKEY"]}",
        symbol_type: 2,
        bundle_id: "#{ENV["PROD_APP_IDENTIFIER"]}",
        product_version: "#{version_number}(#{build_number})",
        channel: 'appstore',
        dsym: dsym_path
      )
    end
    clean_build_artifacts
  end

  desc "手动批量添加设备到profile"
  lane :add_devices_manual do

    UI.header "Add Device"
    device_hash = {}
    device_sum = UI.input("Device Sum: ").to_i
    if device_sum == 0
      next
    end
    index = 0
    while index < device_sum do
      device_name = UI.input("Device Name: ")
      device_udid = UI.input("Device UDID: ")
      device_hash[device_name] = device_udid
      index += 1
    end
    
    register_devices(
        devices: device_hash
    )
    refresh_profiles
  end

  desc "文件批量添加设备到profile"
  lane :add_devices_file do
    register_devices(
      devices_file: "fastlane/devices.txt"
    )
    refresh_profiles
  end

  desc "批量导出设备"
  lane :export_devices do
    password = UI.password("输入 #{ENV["APPLE_ID"]} 账号密码: ")
    Spaceship::Portal.login("#{ENV["APPLE_ID"]}", password)
    Spaceship::Portal.select_team(team_id: "#{ENV["TEAM_ID"]}")
    devices = Spaceship.device.all
    File.open("#{base_path}/fastlane/devices.txt", "wb") do |f|
      f.puts "Device ID\tDevice Name"
      devices.each do |device|
        f.puts "#{device.udid}\t#{device.name}"
      end
    end
  end

  # You can define as many lanes as you want
  desc "更新 provisioning profiles"
  lane :refresh_profiles do
    match(
      type: "development",
      force: true,
      force_for_new_devices: true
    )
    match(
      type: "adhoc",
      force: true,
      force_for_new_devices: true
    )
    match(
      type: "appstore",
      force: true,
      force_for_new_devices: true
    )
  end

  desc "同步 certificates 和 provisioning profiles"
  lane :sync_cert_profiles do
    match(
      type: "development",
      readonly: true
    )
    match(
      type: "adhoc",
      readonly: true
    )
    match(
      type: "appstore",
      readonly: true
    )
  end

  desc "移除本地描述文件"
  lane :remove_local_profiles do
    app_identifiers = ["#{ENV["DEV_APP_IDENTIFIER"]}", "#{ENV["DEV_NOTIFICATION_SERVICE"]}", "#{ENV["PROD_APP_IDENTIFIER"]}", "#{ENV["PROD_NOTIFICATION_SERVICE"]}"]
    types = ["development", "adhoc", "appstore"]
    app_identifiers.each do |app_identifier|
      types.each do |type|
        remove_provisioning_profile(app_identifier: app_identifier, type: type)    
      end
    end
  end

  desc "revoke 证书和描述文件"
  private_lane :revoke_cert_profiles do
    ENV["MATCH_SKIP_CONFIRMATION"] = "1"
    sh("fastlane match nuke development")
    sh("fastlane match nuke distribution")
  end

  desc "生成APNs证书"
  lane :generate_apns_cert do
    pem(
      development: true, 
      force: true, 
      app_identifier: "#{ENV["DEV_APP_IDENTIFIER"]}", 
      p12_password: "GXM", output_path: "fastlane/pem"
    )

    pem(
      development: false, 
      force: true, 
      app_identifier: "#{ENV["DEV_APP_IDENTIFIER"]}", 
      p12_password: "GXM", output_path: "fastlane/pem"
    )

    pem(
      development: true, 
      force: true, 
      app_identifier: "#{ENV["PROD_APP_IDENTIFIER"]}", 
      p12_password: "GXM", output_path: "fastlane/pem"
    )

    pem(
      development: false, 
      force: true, 
      app_identifier: "#{ENV["PROD_APP_IDENTIFIER"]}", 
      p12_password: "GXM", output_path: "fastlane/pem"
    )
  end

  desc "同步 metadata"
  lane :sync_metadata do
    ENV["DELIVER_FORCE_OVERWRITE"] = "1"
    sh("fastlane deliver download_metadata --metadata_path #{ENV["DOWNLOAD_METADATA_PATH"]}")
  end

  desc "拷贝 dSYM"
  private_lane :copy_dsym do |options|
    type = String(options[:type] || "adhoc")
    dsym_path = lane_context[SharedValues::DSYM_OUTPUT_PATH]
    share_dir = File.join(ENV['HOME'],'/Public/iOS', "#{ENV["SCHEME_NAME"]}", "#{type}")
    FileUtils.mkdir_p(share_dir)
    FileUtils.cp_r(File.join(dsym_path), share_dir)
  end

  desc "上传 ipa，type: [pgyer,gxm], log: desc"
  private_lane :upload_ipa do |options|
    type = options[:type] || 'pgyer'
    log = options[:log] || ''
    log = String
    if type == "pgyer"
      pgyer(
        api_key: '0098b94391ff417d86837343597789a9',
        user_key: '4ca1278171177f624ba3f3cc39eb2d73',
        update_description: log
      )
    else
      sh("curl -X 'POST' 'https://fabu.guoxiaomei.com/api/apps/5dca5121f3920d001f71e42d/upload' -H 'Content-Type: multipart/form-data' -H 'accept: application/json' -H 'apikey: 07a0840834294e7b89c41ab9c302c852' -F 'file=@#{lane_context[SharedValues::IPA_OUTPUT_PATH]}'")
    end
  end

  after_all do |lane|
    # This block is called, only if the executed lane was successful

    # slack(
    #   message: "Successfully deployed new App Update."
    # )
  end

  error do |lane, exception|
    # slack(
    #   message: exception.message,
    #   success: false
    # )
  end
end


# More information about multiple platforms in fastlane: https://github.com/fastlane/fastlane/blob/master/fastlane/docs/Platforms.md
# All available actions: https://docs.fastlane.tools/actions

# fastlane reports which actions are used. No personal data is recorded. 
# Learn more at https://github.com/fastlane/fastlane#metrics

```

