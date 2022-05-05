title: Gitalk 评论批量初始化
date: 2020-08-06 18:41:52
tags:
- gitalk
categories: Blog
---

第一次使用 Gitalk 时，之前的文章的评论都需要初始化一下，如果文章多的话，挺麻烦的。不过，有些博客有提供接口获取博客上所有文章的相关信息，那其实就可以通过脚本来完成之前文章的评论初始化。下面是一些已经写好的脚本，可以直接使用或参考。

[Gitalk 官方的 WiKi](https://github.com/gitalk/gitalk/wiki/评论初始化) 里记录的方法年久失修，已经不能使用，我重新整理了一份。

### 获得权限

在使用该脚本之前首先要在 GitHub 创建一个新的 [Personal access tokens](https://github.com/settings/tokens)，选择 Generate new token 后，在当前的页面中为 Token 添加所有 Repo 的权限。

### 自动化脚本

#### 安装脚本依赖库

```shell
$ gem install faraday activesupport sitemap-parser nokogiri
```

#### 使用 sitemap 文件

找到博客对应的 sitemap 文件，例如 https://chaosky.tech/sitemap.xml。

#### 使用脚本

在任意目录创建 **comment.rb**，将下面的代码粘贴到文件中：

```ruby
require 'open-uri'
require 'faraday'
require 'active_support'
require 'active_support/core_ext'
require 'sitemap-parser'
require 'digest'
require 'nokogiri'

username = "xwal" # GitHub 用户名
token = "xxxxxx"  # GitHub Token
repo_name = "xwal.github.io" # 存放 issues
sitemap_url = "https://chaosky.tech/sitemap.xml" # sitemap
kind = "Gitalk"

sitemap = SitemapParser.new sitemap_url
urls = sitemap.to_a

conn = Faraday.new(:url => "https://api.github.com/repos/#{username}/#{repo_name}/issues") do |conn|
  conn.basic_auth(username, token)
  conn.adapter Faraday.default_adapter
end

urls.each_with_index do |url, index|
  id = Digest::MD5.hexdigest URI(url).path
  response = conn.get do |req|
    req.params["labels"] = [kind, id].join(',')
    req.headers['Content-Type'] = 'application/json'
  end
  response_hash = JSON.load(response.body)
  
  if response_hash.count == 0
    document = Nokogiri::HTML(open(url))
    title = document.xpath("//head/title/text()").to_s
    desc = document.xpath("//head/meta[@name='description']/@content").to_s
    body = url + "\n\n" + desc
    puts title
    response = conn.post do |req|
      req.body = { body: body, labels: [kind, id], title: title }.to_json
    end
    puts response.body
  end
  sleep 15 if index % 20 == 0
end
```

在这里有 5 个配置项，分别是 GitHub 用户名、在上一步获得的 Token、存放 issues 的仓库、sitemap 的地址以及最后你在博客中使用了哪个评论插件，不同的插件拥有标签，可以选择 "Gitalk" 或者 "gitment"。

#### 运行脚本

```shell
$ ruby comment.rb
```

### 参考链接

1. <https://github.com/gitalk/gitalk/wiki/评论初始化>
2. <https://draveness.me/git-comments-initialize/>