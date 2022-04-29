require 'open-uri'
require 'faraday'
require 'active_support'
require 'active_support/core_ext'
require 'sitemap-parser'
require 'digest'
require 'nokogiri'

username = "xwal" # GitHub 用户名
token = ENV['GH_ACTION_GITHUB_TOKEN']  # GitHub Token
repo_name = "xwal.github.io" # 存放 issues
sitemap_url = "https://raw.githubusercontent.com/xwal/xwal.github.io/master/sitemap.xml" # sitemap
kind = "Gitalk"

puts "token -> #{token}"

sitemap = SitemapParser.new sitemap_url
urls = sitemap.to_a

conn = Faraday.new(:url => "https://api.github.com/repos/#{username}/#{repo_name}/issues") do |req|
  req.request :authorization, username, token
  req.adapter Faraday.default_adapter
end

index = 0
for url in urls
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
    index += 1
    sleep 15 if index % 20 == 0
  end
end