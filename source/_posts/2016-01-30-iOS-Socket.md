title: iOS Socket
date: 2016-01-30 11:41:39
tags:
- Socket
- TCP/IP
categories: iOS
---

# iOS网络编程层次结构

iOS网络编程层次结构分为三层，从上往下依次为：

- Cocoa层：NSURL，Bonjour，Game Kit，WebKit
- Core Foundation层：基于 C 的 CFNetwork 和 CFNetServices
- OS层：基于 C 的 BSD Socket

Cocoa层：是最上层的基于 Objective-C 的 API，比如 URL访问，NSStream，Bonjour，GameKit等，这是大多数情况下我们常用的 API。Cocoa 层是基于 Core Foundation 实现的。

Core Foundation层：因为直接使用 socket 需要更多的编程工作，所以苹果对 OS 层的 socket 进行简单的封装以简化编程任务。该层提供了 CFNetwork 和 CFNetServices，其中 CFNetwork 又是基于 CFStream 和 CFSocket。

OS层：最底层的 BSD Socket 提供了对网络编程最大程度的控制，但是编程工作也是最多的。因此，苹果建议我们使用 Core Foundation 及以上层的 API 进行编程。

本文将介绍如何在 iOS 系统下使用最底层的 Socket 进行编程。

<!--more-->

# Socket

Socket是应用层与TCP/IP协议族通信的中间软件抽象层，它是一组接口。

![](/images/Socket%E5%B1%82%E6%AC%A1.jpg)

## TCP和UDP的区别

TCP：面向连接、传输可靠(保证数据正确性,保证数据顺序)、用于传输大量数据(流模式)、速度慢，建立连接需要开销较多(时间，系统资源)。

UDP：面向非连接、传输不可靠、用于传输少量数据(数据包模式)、速度快。

关于TCP是一种流模式的协议，UDP是一种数据包模式的协议，这里要说明一下，TCP是面向连接的，也就是说，在连接持续的过程中，Socket中收到的数据都是由同一台主机发出的（劫持什么的不考虑），因此，知道保证数据是有序的到达就行了，至于每次读取多少数据自己看着办。

而UDP是无连接的协议，也就是说，只要知道接收端的IP和端口，且网络是可达的，任何主机都可以向接收端发送数据。这时候，如果一次能读取超过一个报文的数据，则会乱套。比如，主机A向发送了报文P1，主机B发送了报文P2，如果能够读取超过一个报文的数据，那么就会将P1和P2的数据合并在了一起，这样的数据是没有意义的。

## 常用的Socket类型

有两种：流式Socket（SOCK_STREAM）和数据报式Socket（SOCK_DGRAM）。流式是一种面向连接的Socket，针对于面向连接的TCP服务应用；数据报式Socket是一种无连接的Socket，对应于无连接的UDP服务应用。

### TCP C/S架构程序设计基本框架

![](/images/5269612b25e6df1b3ee5ab8352b2c3b6.jpg)

#### TCP 三次握手

![](/images/543019bab569d5cce5143f7a0c25b872.png)

最形象理解：

> 「你瞅啥？」
>
> 「瞅你咋地？」
>
> 「来咱俩唠唠。」
>
> 然后就唠上了。

#### TCP 四次挥手

![](/images/cbb39ed0e10f4a9e8cdeaeb38ebc3695.png)

#### 代码实现

##### 头文件

```
#include <sys/socket.h>
#include <netinet/in.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <ifaddrs.h>
```

##### 服务端实现代码

```
- (void)socketServer
{
    int err;
    // 1. 创建socket套接字
    // 原型：int socket(int domain, int type, int protocol);
    // domain：协议族 type：socket类型 protocol：协议
    int fd = socket(AF_INET, SOCK_STREAM, IPPROTO_IP);
    BOOL success = (fd != -1);
    if (success) {
        NSLog(@"Socket 创建成功");
        // 地址结构体
        struct sockaddr_in addr;
        // 内存清空
        memset(&addr, 0, sizeof(addr));
        // 内存大小
        addr.sin_len=sizeof(addr);
        // 地址族，在socket编程中只能是AF_INET
        addr.sin_family=AF_INET;
        // 端口号
        addr.sin_port=htons(1024);
        // 按照网络字节顺序存储IP地址
        addr.sin_addr.s_addr=INADDR_ANY;

        // 2. 建立地址和套接字的联系（绑定）
        // 原型：bind(sockid, local addr, addrlen)
        err=bind(fd, (const struct sockaddr *)&addr, sizeof(addr));
        success=(err==0);
    }

    // 3. 服务器端侦听客户端的请求
    if (success) {
        NSLog(@"绑定成功");
        // listen( Sockid ,quenlen) quenlen 并发队列
        err=listen(fd, 5);//开始监听
        success=(err==0);
    }
    if (success) {
        NSLog(@"监听成功");
        // 4. 一直阻塞等到客户端的连接
        while (true) {
            struct sockaddr_in peeraddr;
            int peerfd;
            socklen_t addrLen;
            addrLen = sizeof(peeraddr);
            NSLog(@"等待客户端的连接请求");
            // 5. 服务器端等待从编号为Sockid的Socket上接收客户端连接请求
            // 原型：newsockid=accept(Sockid，Clientaddr, paddrlen)
            peerfd = accept(fd, (struct sockaddr *)&peeraddr, &addrLen);
            success=(peerfd!=-1);
            // 接收客户端请求成功
            if (success) {
                NSLog(@"接收客户端请求成功，客户端地址：%s, 端口号：%d",inet_ntoa(peeraddr.sin_addr), ntohs(peeraddr.sin_port));
                send(peerfd, "欢迎进入Socket聊天室", 1024, 0);
                // 6. 创建新线程接收客户端发送的消息
                [NSThread detachNewThreadSelector:@selector(reciveMessage:) toTarget:self withObject:@(peerfd)];
            }
        }
    }
}

- (void)reciveMessage:(id) peerfd
{
    int fd = [peerfd intValue];
    char buf[1024];
    ssize_t bufLen;
    size_t len=sizeof(buf);

    // 循环阻塞接收客户端发送的消息
    do {
        bufLen = recv(fd, buf, len, 0);
        // 当返回值小于等于零时，表示socket异常或者socket关闭，退出循环阻塞接收消息
        if (bufLen <= 0) {
            break;
        }
        // 接收到的信息
        NSString* msg = [NSString stringWithCString:buf encoding:NSUTF8StringEncoding];
        NSLog(@"来自客户端，消息内容：%@", msg);
        memset(buf, 0, sizeof(buf));
    } while (true);
    // 7. 关闭
    close(fd);
}
```

##### 客户端代码

```
- (void)createSocketClient
{
    int err;
    // 创建socket套接字
    int fd =socket(AF_INET, SOCK_STREAM, 0);
    BOOL success=(fd!=-1);
    struct sockaddr_in addr;
    if (success) {
        NSLog(@"Socket创建成功");
        memset(&addr, 0, sizeof(addr));
        addr.sin_len = sizeof(addr);
        addr.sin_family = AF_INET;
        addr.sin_addr.s_addr = INADDR_ANY;

        // 建立地址和套接字的联系
        err = bind(fd, (const struct sockaddr *)&addr, sizeof(addr));
        success = (err==0);
    }
    if (success) {
        struct sockaddr_in serveraddr;
        memset(&serveraddr, 0, sizeof(serveraddr));
        serveraddr.sin_len=sizeof(serveraddr);
        serveraddr.sin_family=AF_INET;
        // 服务器端口
        serveraddr.sin_port=htons(1024);
        // 服务器的地址
        serveraddr.sin_addr.s_addr=inet_addr("192.168.2.5");
        socklen_t addrLen;
        addrLen =sizeof(serveraddr);
        NSLog(@"连接服务器中...");
        err=connect(fd, (struct sockaddr *)&serveraddr, addrLen);
        success=(err==0);
        if (success) {
            // getsockname 是对tcp连接而言。套接字socket必须是已连接套接字描述符。
            err =getsockname(fd, (struct sockaddr *)&addr, &addrLen);
            success=(err==0);
            if (success) {
                NSLog(@"连接服务器成功，本地地址：%s，端口：%d",inet_ntoa(addr.sin_addr),ntohs(addr.sin_port));
                [NSThread detachNewThreadSelector:@selector(reciveMessage:) toTarget:self withObject:@(fd)];
            }
        }
        else{
            NSLog(@"connect failed");
        }
    }
}

- (void)reciveMessage:(id) peerfd
{
    int fd = [peerfd intValue];
    char buf[1024];
    ssize_t bufLen;
    size_t len=sizeof(buf);

    // 循环阻塞接收消息
    do {
        bufLen = recv(fd, buf, len, 0);
        // 当返回值小于等于零时，表示socket异常或者socket关闭，退出循环阻塞接收消息
        if (bufLen <= 0) {
            break;
        }
        // 接收到的信息
        NSString* msg = [NSString stringWithCString:buf encoding:NSUTF8StringEncoding];

        NSLog(@"来自服务端，消息内容：%@", msg);
    } while (true);
    // 7. 关闭
    close(fd);
}
```



#### UDP C/S架构程序设计基本框架

![](/images/cd6d1690d3d6eefd300987e590c1483f.jpg)

### 字节顺序

计算机数据表示存在两种字节顺序：NBO与HBO

网络字节顺序NBO（Network Byte Order）：

>   按从高到低的顺序存储，在网络上使用统一的网络字节顺序，可以避免兼容性问题。

主机字节顺序（HBO，Host Byte Order）：

> 不同的机器HBO不相同，与CPU设计有关，数据的顺序是由cpu决定的，而与操作系统无关。
>
> 不同的CPU有不同的字节顺序类型，这些字节顺序类型指的是整数在内存中保存的顺序，即主机字节顺序。常见的有两种：
>
> | 序号   | 英文名           | 中文名  | 描述          |
> | ---- | ------------- | ---- | ----------- |
> | 1    | big-endian    | 大尾顺序 | 地址的低位存储值的高位 |
> | 2    | little-endian | 小尾顺序 | 地址的低位存储值的低位 |
>
> 如 Intelx86结构下,short型数0x1234表示为34 12, int型数0x12345678表示为78 56 34 12如IBM power PC结构下,short型数0x1234表示为12 34, int型数0x12345678表示为12   34 56 78

网络字节顺序与本地字节顺序之间的转换函数：

```
  htonl()--"Host to Network Long"
  ntohl()--"Network to Host Long"
  htons()--"Host to Network Short"
  ntohs()--"Network to Host Short"
```

### 地址转换方法

#### in_addr_t inet_addr(const char *)

将一个点间隔地址转换成一个in_addr

#### char *inet_ntoa(struct in_addr)

将网络地址转换成“.”点隔的字符串格式。

#### int inet_aton(const char *, struct in_addr *)

将一个字符串IP地址转换为一个32位的网络序列IP地址。

### 获取地址

#### 用getsockname获得本地ip和port

#### 用getpeername获得对端ip和port

套接字socket必须是已连接套接字描述符。

### 获取本地IP地址

参考stackoverflow链接：<http://stackoverflow.com/questions/7072989/iphone-ipad-osx-how-to-get-my-ip-address-programmatically>

```
// 导入头文件
#include <ifaddrs.h>
```

```
// 实现代码
- (NSString *)getIPAddress {

    NSString *address = @"error";
    struct ifaddrs *interfaces = NULL;
    struct ifaddrs *temp_addr = NULL;
    int success = 0;
    // retrieve the current interfaces - returns 0 on success
    success = getifaddrs(&interfaces);
    if (success == 0) {
        // Loop through linked list of interfaces
        temp_addr = interfaces;
        while(temp_addr != NULL) {
            if(temp_addr->ifa_addr->sa_family == AF_INET) {
                // Check if interface is en0 which is the wifi connection on the iPhone
                if([[NSString stringWithUTF8String:temp_addr->ifa_name] isEqualToString:@"en0"]) {
                    // Get NSString from C String
                    address = [NSString stringWithUTF8String:inet_ntoa(((struct sockaddr_in *)temp_addr->ifa_addr)->sin_addr)];

                }

            }

            temp_addr = temp_addr->ifa_next;
        }
    }
    // Free memory
    freeifaddrs(interfaces);
    return address;

}
```

# 第三方库

CocoaAsyncSocket：<https://github.com/robbiehanson/CocoaAsyncSocket>

CocoaAsyncSocket provides easy-to-use and powerful asynchronous socket libraries for Mac and iOS. The classes are described below.

# 参考链接

- <http://www.coderyi.com/archives/429>
- <http://www.cnblogs.com/kesalin/archive/2013/04/13/cocoa_socket.html>
- <http://my.oschina.net/joanfen/blog/287238>
