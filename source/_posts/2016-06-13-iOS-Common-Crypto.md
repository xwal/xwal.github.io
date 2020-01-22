title: iOS 密码技术
date: 2016-06-13 12:27:03
tags: 
- Cryptography
- 密码技术
categories: iOS
---

## 转码技术

### URL转码（百分号转码）

URL：只有字母和数字[0-9a-zA-Z]、一些特殊符号`$-_.+!*'(),[不包括双引号]`、以及某些保留字，才可以不经过编码直接用于URL。

#### URL 编码实现

```objective-c
// 废弃接口
- (NSString *)stringByAddingPercentEscapesUsingEncoding:(NSStringEncoding)encoding
// iOS 7 之后
- (NSString *)stringByAddingPercentEncodingWithAllowedCharacters:(NSCharacterSet *)allowedCharacters
```

#### URL 解码实现

```objective-c
// 废弃接口
- (NSString *)stringByReplacingPercentEscapesUsingEncoding:(NSStringEncoding)encoding
// iOS 7 之后
@property(readonly, copy) NSString *stringByRemovingPercentEncoding
```

#### 参考链接

- <http://www.w3school.com.cn/tags/html_ref_urlencode.html>
- [维基百科](https://zh.wikipedia.org/wiki/百分号编码)
- [在线工具](http://tool.oschina.net/encode?type=4)

<!-- more -->

### Base64 转码

Base64是一种基于64个可打印字符来表示二进制数据的表示方法。由于2的6次方等于64，所以每6个比特为一个单元，对应某个可打印字符。三个字节有24个比特，对应于4个Base64单元，即3个字节需要用4个可打印字符来表示。它可用来作为电子邮件的传输编码。在Base64中的可打印字符包括字母A-Z、a-z、数字0-9，这样共有62个字符，此外两个可打印符号在不同的系统中而不同。

#### Base64索引表

数值	字符	 	数值	字符	 	数值	字符	 	数值	字符
0	A	16	Q	32	g	48	w
1	B	17	R	33	h	49	x
2	C	18	S	34	i	50	y
3	D	19	T	35	j	51	z
4	E	20	U	36	k	52	0
5	F	21	V	37	l	53	1
6	G	22	W	38	m	54	2
7	H	23	X	39	n	55	3
8	I	24	Y	40	o	56	4
9	J	25	Z	41	p	57	5
10	K	26	a	42	q	58	6
11	L	27	b	43	r	59	7
12	M	28	c	44	s	60	8
13	N	29	d	45	t	61	9
14	O	30	e	46	u	62	+
15	P	31	f	47	v	63	/

#### 例子：编码『Man』

文本：Man

ASCII编码：77 97 110

二进制位：01001101 01100001 01101110

索引：19 22 5 46

Base64编码：TWFu

如果要编码的字节数不能被3整除，最后会多出1个或2个字节，那么可以使用下面的方法进行处理：先使用0字节值在末尾补足，使其能够被3整除，然后再进行base64的编码。在编码后的base64文本后加上一个或两个'='号，代表补足的字节数。也就是说，当最后剩余一个八位字节（一个byte）时，最后一个6位的base64字节块有四位是0值，最后附加上两个等号；如果最后剩余两个八位字节（2个byte）时，最后一个6位的base字节块有两位是0值，最后附加一个等号。

#### Base64 编码实现

```objective-c
- (NSData *)base64EncodedDataWithOptions:(NSDataBase64EncodingOptions)options
- (NSString *)base64EncodedStringWithOptions:(NSDataBase64EncodingOptions)options
```

#### Base64 解码实现

```objective-c
- (instancetype)initWithBase64EncodedData:(NSData *)base64Data options:(NSDataBase64DecodingOptions)options
- (instancetype)initWithBase64EncodedString:(NSString *)base64String options:(NSDataBase64DecodingOptions)options
```

#### 参考链接

- [维基百科](https://zh.wikipedia.org/zh-cn/Base64)
- <http://tool.oschina.net/encrypt?type=3>

## 对称密码（共享密钥密码）——用相同的密钥进行加密和解密

### 一次性密码本——绝对不会被破译的密码

一次性密码本是一种非常简单的密码，它的原理是『将明文与一串随机的比特序列进行XOR运算』。

为什么一次性密码本是绝对无法破译的呢？我们假设对一次性密码本的密文尝试进行暴力破解，那么总有一天我们会尝试到和加密时相同的密钥，**但是我们无法判断它是否是正确的明文**。

一次性密码本是**无条件安全的，在理论上是无法破译的。**

### DES（Data Encryption Standard）

DES是一种将64比特的明文加密成64比特的密文的对称密码算法，他的密钥长度是56比特。尽管从规格上来说，DES的密钥长度是64比特，但由于每隔7比特会设置一个用于错误检测的比特，因此实质上器密钥长度是56比特。

**PS：现在DES已经能够被暴力破解。**

#### DES加密实现

```objective-c
/**
 *  DES加密
 *
 *  @param data 加密的二进制数据
 *  @param key  加密的密钥，长度为8字节
 *  @param iv   初始化向量，每次加密时都会随机产生一个不同的比特序列来作为初始化向量
 *
 *  @return 加密后的二进制数据
 */
NSData * desEncrypt(NSData * data, NSData * key, NSData * iv)
{
	// 密码长度为8字节  
    if ([key length] != 8) {
        @throw [NSException exceptionWithName:@"DES Encrypt"
                                       reason:@"Length of key is wrong. Length of iv should be 8(64bits)"
                                     userInfo:nil];
    }
    // 加密后的数据长度为数据长度+DES block size
    size_t bufferSize = [data length] + kCCBlockSizeDES;
    void * buffer = malloc(bufferSize);
    size_t encryptedSize = 0;
    // DES加密
    CCCryptorStatus cryptStatus = CCCrypt(kCCEncrypt,
                                          kCCAlgorithmDES,
                                          kCCOptionPKCS7Padding,
                                          [key bytes], kCCKeySizeDES,
                                          [iv bytes],
                                          [data bytes],
                                          [data length],
                                          buffer, bufferSize,
                                          &encryptedSize);
  	// 判断加密是否成功
    if (cryptStatus == kCCSuccess) {
        NSData * encryptedData = [NSData dataWithBytes:buffer length:encryptedSize];
        free(buffer);
        return encryptedData;
    }else{
        free(buffer);
        @throw [NSException exceptionWithName:@"DES Encrypt"
                                       reason:@"Encrypt Error!"
                                     userInfo:nil];
        return nil;
    }
}
```

#### DES解密实现

```objective-c
/**
 *  DES 解密
 *
 *  @param data 解密的二进制数据
 *  @param key  解密的密钥，长度8字节
 *  @param iv   初始化向量
 *
 *  @return 解密后的数据
 */
NSData *desDecrypt(NSData * data, NSData * key, NSData * iv)
{
    if ([key length] != 8) {
        @throw [NSException exceptionWithName:@"DES Encrypt"
                                       reason:@"Length of key is wrong. Length of iv should be 8(64bits)"
                                     userInfo:nil];
    }
    // 加密后的数据长度为数据长度+DES block size
    size_t bufferSize = [data length] + kCCBlockSizeDES;
    void * buffer = malloc(bufferSize);
    size_t decryptedSize = 0;


    CCCryptorStatus cryptStatus = CCCrypt(kCCDecrypt,
                                          kCCAlgorithmDES,
                                          kCCOptionPKCS7Padding,
                                          [key bytes], kCCKeySizeDES,
                                          [iv bytes],
                                          [data bytes],
                                          [data length],
                                          buffer, bufferSize,
                                          &decryptedSize);
    if (cryptStatus == kCCSuccess) {
        NSData * decryptedData = [NSData dataWithBytes:buffer length:decryptedSize];
        free(buffer);
        return decryptedData;
    }else{
        free(buffer);
        @throw [NSException exceptionWithName:@"DES Decrypt"
                                       reason:@"Decrypt Error!"
                                     userInfo:nil];
        return nil;
    }
}
```

#### 参考链接

- <https://zh.wikipedia.org/wiki/資料加密標準>

### 3DES（ Triple Data Encryption Standard）

** 三重DES（triple-DES）** 是为了增加DES的强度，将DES重复3次所得到的一种密码算法，通常缩写为**3DES**。

- <https://zh.wikipedia.org/wiki/三重資料加密演算法>

### AES（Advanced Encryption Standard）

高级加密标准（英语：Advanced Encryption Standard，缩写：AES），在密码学中又称Rijndael加密法，是美国联邦政府采用的一种区块加密标准。这个标准用来替代原先的DES，已经被多方分析且广为全世界所使用。经过五年的甄选流程，高级加密标准由美国国家标准与技术研究院（NIST）于2001年11月26日发布于FIPS PUB 197，并在2002年5月26日成为有效的标准。2006年，高级加密标准已然成为对称密钥加密中最流行的算法之一。

- <https://zh.wikipedia.org/wiki/高级加密标准>

### 对称加密/解密实现

```objective-c
CCCryptorStatus CCCrypt(
    CCOperation op,         /* kCCEncrypt, etc. */
    CCAlgorithm alg,        /* kCCAlgorithmAES128, etc. */
    CCOptions options,      /* kCCOptionPKCS7Padding, etc. */
    const void *key,
    size_t keyLength,
    const void *iv,         /* optional initialization vector */
    const void *dataIn,     /* optional per op and alg */
    size_t dataInLength,
    void *dataOut,          /* data RETURNED here */
    size_t dataOutAvailable,
    size_t *dataOutMoved)
```

#### CCOperation：加密解密操作

```objective-c
/*!
    @enum       CCOperation
    @abstract   密码操作类型.

    @constant   kCCEncrypt  对称加密.
    @constant   kCCDecrypt  对称解密.
*/
enum {
    kCCEncrypt = 0,
    kCCDecrypt,     
};
typedef uint32_t CCOperation;
```

#### CCAlgorithm：加密算法

```objective-c
/*!
    @enum       CCAlgorithm
    @abstract   Encryption algorithms implemented by this module.

    @constant   kCCAlgorithmAES128  Advanced Encryption Standard, 128-bit block
                                    This is kept for historical reasons.  It's
                                    preferred now to use kCCAlgorithmAES since
                                    128-bit blocks are part of the standard.
    @constant   kCCAlgorithmAES     Advanced Encryption Standard, 128-bit block
    @constant   kCCAlgorithmDES     Data Encryption Standard
    @constant   kCCAlgorithm3DES    Triple-DES, three key, EDE configuration
    @constant   kCCAlgorithmCAST    CAST
 	@constant   kCCAlgorithmRC4     RC4 stream cipher
 	@constant   kCCAlgorithmBlowfish    Blowfish block cipher
*/
enum {
    kCCAlgorithmAES128 = 0,
    kCCAlgorithmAES = 0,
    kCCAlgorithmDES,
    kCCAlgorithm3DES,       
    kCCAlgorithmCAST,       
    kCCAlgorithmRC4,
    kCCAlgorithmRC2,   
    kCCAlgorithmBlowfish    
};
typedef uint32_t CCAlgorithm;
```

#### CCOptions：配置选项

```
/*!
    @enum       CCOptions
    @abstract   Options flags, passed to CCCryptorCreate().

    @constant   kCCOptionPKCS7Padding   Perform PKCS7 padding.
    @constant   kCCOptionECBMode        Electronic Code Book Mode.
                                        Default is CBC.
*/
enum {
    /* options for block ciphers */
    kCCOptionPKCS7Padding   = 0x0001,
    kCCOptionECBMode        = 0x0002
    /* stream ciphers currently have no options */
};
typedef uint32_t CCOptions;
```

PKCS：Public Key Cryptography Standards，公钥加密标准

PKCS7：密码消息语法标准（Cryptographic Message Syntax Standard）

ECB：电子密码本（Electronic codebook，ECB）模式。需要加密的消息按照块密码的块大小被分为数个块，并对每个块进行独立加密。

![](https://upload.wikimedia.org/wikipedia/commons/c/c4/Ecb_encryption.png)

CBC：在CBC模式中，每个平文块先与前一个密文块进行异或后，再进行加密。在这种方法中，每个密文块都依赖于它前面的所有平文块。同时，为了保证每条消息的唯一性，在第一个块中需要使用初始化向量。

![](https://upload.wikimedia.org/wikipedia/commons/d/d3/Cbc_encryption.png)

#### key、keyLength：密钥长度

密钥长度必须为指定的长度。

```objective-c
enum {
    kCCKeySizeAES128          = 16,
    kCCKeySizeAES192          = 24,
    kCCKeySizeAES256          = 32,
    kCCKeySizeDES             = 8,
    kCCKeySize3DES            = 24,
    kCCKeySizeMinCAST         = 5,
    kCCKeySizeMaxCAST         = 16,
    kCCKeySizeMinRC4          = 1,
    kCCKeySizeMaxRC4          = 512,
    kCCKeySizeMinRC2          = 1,
    kCCKeySizeMaxRC2          = 128,
    kCCKeySizeMinBlowfish     = 8,
    kCCKeySizeMaxBlowfish     = 56,
};
```

#### iv：初始化向量（可选）

初始化向量（IV，Initialization Vector）是许多工作模式中用于随机化加密的一块数据，因此可以由相同的明文，相同的密钥产生不同的密文，而无需重新产生密钥，避免了通常相当复杂的这一过程。

**用于CBC模式**。如果存在，必须和选择算法的block size一样长。

如果使用ECB模式或者使用流式密码算法将自动忽略。

`Byte iv[] = {0x12, 0x34, 0x56, 0x78, 0x90, 0xAB, 0xCD, 0xEF};`

#### dataIn、dataInLength：要加密或解密的数据

#### dataOut、dataOutAvailable：加密或解密后的输出数据

创建对应算法需要的输出数据字节大小。输出数据的bufferSize足够大，大约要加密数据的长度+kCCBlockSize长度。

示例如下，DES加密解密需要的内存块大小。

```objective-c
size_t bufferSize = [data length] + kCCBlockSizeDES;
void *buffer = malloc(bufferSize);
```

```objective-c
/*!
    @enum           Block sizes

    @discussion     Block sizes, in bytes, for supported algorithms.

    @constant kCCBlockSizeAES128    AES block size (currently, only 128-bit
                                    blocks are supported).
    @constant kCCBlockSizeDES       DES block size.
    @constant kCCBlockSize3DES      Triple DES block size.
    @constant kCCBlockSizeCAST      CAST block size.
*/
enum {
    /* AES */
    kCCBlockSizeAES128        = 16,
    /* DES */
    kCCBlockSizeDES           = 8,
    /* 3DES */
    kCCBlockSize3DES          = 8,
    /* CAST */
    kCCBlockSizeCAST          = 8,
    kCCBlockSizeRC2           = 8,
    kCCBlockSizeBlowfish      = 8,
};
```

#### dataOutMoved

成功时，返回写入到dataOut内存块中字节数。

kCCBufferTooSmall时，返回需要提供不足的内存空间大小。

#### CCCryptorStatus：返回加密/解密状态

```objective-c
enum {
    kCCSuccess          = 0,
    kCCParamError       = -4300,
    kCCBufferTooSmall   = -4301,
    kCCMemoryFailure    = -4302,
    kCCAlignmentError   = -4303,
    kCCDecodeError      = -4304,
    kCCUnimplemented    = -4305,
    kCCOverflow         = -4306,
    kCCRNGFailure       = -4307,
};
```


公钥密码——用公钥加密，用私钥解密
---

公钥密码（public-key cryptography）中，密钥分为加密密钥和解密密钥两种，发送者用加密密钥对消息进行加密，接收者用解密密钥对密文进行解密。

仔细思考一下加密密钥和解密密钥的区别，我们可以发现：

- 发送者只需要加密密钥
- 接收者只需要解密密钥
- 解密密钥不可以被窃听者获取
- 加密密钥被窃听者获取也没问题

公钥密码中，加密密钥一般是公开的。正是由于加密密钥可以任意公开，因此该密钥被称为**公钥（public key）**。当然，我们也没有必要将公钥公开给全世界所有的人，但至少我们需要将公钥发送给需要使用公钥进行加密的通信对象（也就是给自己发送密文的发送者）。

相对地，解密密钥是绝对不能公开的，这个密钥只能由你自己来使用，一次成为**私钥（private key）**。私钥不可以被别人知道，也不可以将它发送给别人，甚至也不能发送给自己的通信对象。

公钥和私钥是一一对应的，一对公钥和私钥统称为**密钥对（key pair）**，由公钥进行加密的密文，必须使用与该公钥配对的私钥才能够解密。密钥对中的两个密钥之间具有非常密切的关系——数学上的关系——因此公钥和私钥是不能分别单独生成的。

公钥密码的使用者需要生成一个包括公钥和私钥的密钥对，其中公钥会发送给别人，而私钥则仅供自己使用。

常见的公钥加密算法有：RSA、ElGamal、背包算法、Rabin（RSA的特例）、迪菲－赫尔曼密钥交换协议中的公钥加密算法、椭圆曲线加密算法（英语：Elliptic Curve Cryptography, ECC）。使用最广泛的是RSA算法（由发明者Rivest、Shmir和Adleman姓氏首字母缩写而来）是著名的公开金钥加密算法，ElGamal是另一种常用的非对称加密算法。

**RSA加密算法**是一种**非对称加密算法**。在公开密钥加密和电子商业中RSA被广泛使用。

### RSA密钥生成命令

```objective-c
// 生成RSA私钥
$ openssl genrsa -out rsa_private_key.pem 1024
// 生成RSA公钥
$ openssl rsa -in rsa_private_key.pem -pubout -out rsa_public_key.pem
// 将RSA私钥转换成PKCS8格式
openssl pkcs8 -topk8 -inform PEM -in rsa_private_key.pem -outform PEM -nocrypt
```

## 单向散列函数——获取消息的『指纹』
散列函数（或散列算法，又称哈希函数，英语：Hash Function）是一种从任何一种数据中创建小的数字“指纹”的方法。散列函数把消息或数据压缩成摘要，使得数据量变小，将数据的格式固定下来。该函数将数据打乱混合，重新创建一个叫做散列值（hash values，hash codes，hash sums，或hashes）的指纹。散列值通常用来代表一个短的随机字母和数字组成的字符串。好的散列函数在输入域中很少出现散列冲突。在散列表和数据处理中，不抑制冲突来区别数据，会使得数据库记录更难找到。

![散列函数的工作原理](https://upload.wikimedia.org/wikipedia/commons/d/da/Hash_function.svg)

单向散列函数，就是把任意长的输入消息串变化成固定长的输出串且由输出串难以得到输入串的一种函数。这个输出串称为该消息的散列值。

### 术语

**单向散列函数**：也称为**消息摘要函数**（message digest function），**哈希函数**或者**杂凑函数**。

输入单向散列函数的**消息**也称为**原像**（pre-image）。

单向散列函数输出的**散列值**也称为**消息摘要**（message digest）或者**指纹**（fingerprint）。

完整性也称为一致性。

### 性质

- #### 根据任意长度的消息计算出固定长度的散列值

  首先，单向散列函数的输入必须能够使任意长度的消息。其次，无论输入多长的消息，单向散列函数必须都能够生成长度很短的散列值，散列值的长度最好是短且固定的。

- #### 能够快速计算出散列值

- #### 消息不同散列值也不同

  当给定某条消息的散列值时，单向散列函数必须确保**要找到和该条消息具备相同散列值的另外一条消息是非常困难的**。这一性质称为『**弱抗碰撞性**』。单向散列函数都必须具备弱抗碰撞性。

  和弱抗碰撞性相对的，还有强抗碰撞性，所谓强抗碰撞性，是指**要找到散列值相同的两条不同的消息是非常困难的**。在这里，散列值可以是任意值。

- #### 具备单向性

  单向散列函数必须具备单向性，单向性指的是无法通过散列值反算出消息的性质。

### 应用场景

- #### 检测软件是否被篡改

- #### 基于口令的加密

  单向散列函数也被用于基于口令的加密（Password Based Encryption, PBE）

  PBE的原理是将口令和盐（salt，通过伪随机数生成器产生的随机值）混合后计算其散列值，然后将这个散列值用作加密的密钥。

- #### 消息认证码

  消息认证码是将『发送者和接收者之间的共享密钥』和『消息』进行混合后计算出的散列值。使用消息认证码可以检测并防止通信过程中的错误、篡改以及伪装。

- #### 数字签名

  数字签名是现实社会中的签名（sign）和盖章这样的行为在数字世界中实现。数字签名的处理过程非常耗时，一次一般不会对整个消息内容直接施加数字签名，而是先通过单向散列函数计算出消息的散列值，然后再对这个散列值施加数字签名。

- #### 伪随机数生成器

  密码技术中所使用的随机数需要具备『事实上不可能根据过去的随机数列预测未来的随机数列』这样的性质。为了保证不可预测性，可以利用单向散列函数的单向性。

- #### 一次性口令

  一次性口令经常被用于服务器对客户端的合法性认证。在这种方式中，通过使用单向散列函数可以保证口令只在通信链路上传送一次，因此即使窃听者窃取了口令，也无法使用。

### MD5

MD5消息摘要算法（英语：MD5 Message-Digest Algorithm），一种被广泛使用的密码散列函数，可以产生出一个128位（16字节）的散列值（hash value），用于确保信息传输完整一致。

**PS：已发现碰撞。**

#### 应用场景

MD5已经广泛使用在为文件传输提供一定的可靠性方面。例如，服务器预先提供一个MD5校验和，用户下载完文件以后，用MD5算法计算下载文件的MD5校验和，然后通过检查这两个校验和是否一致，就能判断下载的文件是否出错。

MD5亦有应用于部分网上赌场以保证赌博的公平性，原理是系统先在玩家下注前已生成该局的结果，将该结果的字符串配合一组随机字符串利用MD5 加密，将该加密字符串于玩家下注前便显示给玩家，再在结果开出后将未加密的字符串显示给玩家，玩家便可利用MD5工具加密验证该字符串是否吻合。

例子: 在玩家下注骰宝前，赌场便先决定该局结果，假设生成的随机结果为4、5、 6大，赌场便会先利用MD5 加密“4, 5, 6”此字符串并于玩家下注前告诉玩家；由于赌场是无法预计玩家会下什么注，所以便能确保赌场不能作弊；当玩家下注完毕后，赌场便告诉玩家该原始字符串，即“4, 5, 6”，玩家便可利用MD5工具加密该字符串是否与下注前的加密字符串吻合。

该字符串一般会加上一组随机字符串 (Random string)，以防止玩家利用碰撞 (Collision) 解密字符串，但如使用超级电脑利用碰撞亦有可能从加上随机字符串的加密字符串中获取游戏结果。随机字符串的长度与碰撞的次数成正比关系，一般网上赌场使用的随机字符串是长于20字，有些网上赌场的随机字符串更长达500字，以增加解密难度。

#### MD5代码实现

```objective-c
/*** MD5 ***/
#define CC_MD5_DIGEST_LENGTH    16          /* digest length in bytes */
#define CC_MD5_BLOCK_BYTES      64          /* block size in bytes */
unsigned char *CC_MD5(const void *data, CC_LONG len, unsigned char *md)
```

#### 参考链接

- <https://zh.wikipedia.org/wiki/MD5>

### SHA家族

**安全散列算法**（英语：Secure Hash Algorithm，缩写为SHA）是一个密码散列函数家族，是FIPS所认证的五种安全散列算法。能计算出一个数字消息所对应到的，长度固定的字符串（又称消息摘要）的算法。且若输入的消息不同，它们对应到不同字符串的概率很高。这些算法之所以称作“安全”是基于以下两点（根据官方标准的描述）：

- 由消息摘要反推原输入消息，从计算理论上来说是很困难的。
- 想要找到两组不同的消息对应到相同的消息摘要，从计算理论上来说也是很困难的。任何对输入消息的变动，都有很高的概率导致其产生的消息摘要迥异。

SHA家族的五个算法，分别是SHA-1、SHA-224、SHA-256、SHA-384，和SHA-512，由美国国家安全局（NSA）所设计，并由美国国家标准与技术研究院（NIST）发布；是美国的政府标准。后四者有时并称为SHA-2。SHA-1在许多安全协议中广为使用，包括TLS和SSL、PGP、SSH、S/MIME和IPsec，曾被视为是MD5（更早之前被广为使用的散列函数）的后继者。但SHA-1的安全性如今被密码学家严重质疑；虽然至今尚未出现对SHA-2有效的攻击，它的算法跟SHA-1基本上仍然相似；因此有些人开始发展其他替代的散列算法。缘于最近[何时？]对SHA-1的种种攻击发表，“美国国家标准与技术研究院（NIST）开始设法经由公开竞争管道（类似高级加密标准AES的发展经过），发展一个或多个新的散列算法。”

![](http://file.blog.chaosky.tech/2016-06-12-Snip20160612_1.png)

![](http://file.blog.chaosky.tech/2016-06-12-Snip20160612_2.png)

#### SHA代码实现

##### SHA-1

```objective-c
/*** SHA1 ***/
#define CC_SHA1_DIGEST_LENGTH   20          /* digest length in bytes */
#define CC_SHA1_BLOCK_BYTES     64          /* block size in bytes */
unsigned char *CC_SHA1(const void *data, CC_LONG len, unsigned char *md)
```

##### SHA-224

```objective-c
/*** SHA224 ***/
#define CC_SHA224_DIGEST_LENGTH     28          /* digest length in bytes */
#define CC_SHA224_BLOCK_BYTES       64          /* block size in bytes */
unsigned char *CC_SHA224(const void *data, CC_LONG len, unsigned char *md)
```

##### SHA-256

```objective-c
/*** SHA256 ***/
#define CC_SHA256_DIGEST_LENGTH     32          /* digest length in bytes */
#define CC_SHA256_BLOCK_BYTES       64          /* block size in bytes */
unsigned char *CC_SHA256(const void *data, CC_LONG len, unsigned char *md)
```

##### SHA-384

```objective-c
/*** SHA384 ***/
#define CC_SHA384_DIGEST_LENGTH     48          /* digest length in bytes */
#define CC_SHA384_BLOCK_BYTES      128          /* block size in bytes */
unsigned char *CC_SHA384(const void *data, CC_LONG len, unsigned char *md)
```

##### SHA-512

```objective-c
/*** SHA512 ***/
#define CC_SHA512_DIGEST_LENGTH     64          /* digest length in bytes */
#define CC_SHA512_BLOCK_BYTES      128          /* block size in bytes */
unsigned char *CC_SHA512(const void *data, CC_LONG len, unsigned char *md)
```

### 参考链接

- <https://zh.wikipedia.org/wiki/散列函數>
- [在线工具](http://tool.oschina.net/encrypt?type=2)



消息认证码
---

### 基本概念

**消息认证码**（message authentication code）是一种确认完整性并进行认证的技术，简称『**MAC**』。

消息认证码的输入包括任意长度的消息和一个发送者与接收者之间**共享的密钥**，他可以输出固定长度的数据，这个数据称为**MAC值**。

使用SHA-1、MD5之类的单向散列函数可以实现消息认证码，其中一种实现方法称为**HMAC**。

**密钥散列消息认证码**（英语：Keyed-hash message authentication code，缩写为HMAC），又称散列消息认证码（Hash-based message authentication code），是一种通过特别计算方式之后产生的消息认证码（MAC），使用密码散列函数，同时结合一个加密密钥。它可以用来保证数据的完整性，同时可以用来作某个消息的身份验证。

### HMAC的应用

hmac主要应用在身份验证中，它的使用方法是这样的：
(1) 客户端发出登录请求（假设是浏览器的GET请求）
(2) 服务器返回一个随机值，并在会话中记录这个随机值
(3) 客户端将该随机值作为密钥，用户密码进行hmac运算，然后提交给服务器
(4) 服务器读取用户数据库中的用户密码和步骤2中发送的随机值做与客户端一样的hmac运算，然后与用户发送的结果比较，如果结果一致则验证用户合法。

在这个过程中，可能遭到安全攻击的是服务器发送的随机值和用户发送的hmac结果，而对于截获了这两个值的黑客而言这两个值是没有意义的，绝无获取用户密码的可能性，随机值的引入使hmac只在当前会话中有效，大大增强了安全性和实用性。

### HMAC实现

```objective-c
void CCHmac(
    CCHmacAlgorithm algorithm,  /* kCCHmacSHA1, kCCHmacMD5 */
    const void *key,
    size_t keyLength,           /* length of key in bytes */
    const void *data,
    size_t dataLength,          /* length of data in bytes */
    void *macOut)               /* MAC written here */
```

### 参考链接

- [密钥散列消息认证码——维基百科](https://zh.wikipedia.org/wiki/金鑰雜湊訊息鑑別碼)



Key Derivation（密钥导出）
---

PBKDF2(Password-Based Key Derivation Function)是一个用来导出密钥的函数，常用于生成加密的密码。

它的基本原理是通过一个伪随机函数（例如HMAC函数），把明文和一个盐值作为输入参数，然后重复进行运算，并最终产生密钥。

如果重复的次数足够大，破解的成本就会变得很高。而盐值的添加也会增加“彩虹表”攻击的难度。

### PBKDF2函数的定义

DK = PBKDF2(PRF, Password, Salt, c, dkLen)
PRF是一个伪随机函数，例如HASH_HMAC函数，它会输出长度为hLen的结果。
Password是用来生成密钥的原文密码。
Salt是一个加密用的盐值。
c是进行重复计算的次数。
dkLen是期望得到的密钥的长度。
DK是最后产生的密钥。

#### PBKDF代码实现

```objective-c
int CCKeyDerivationPBKDF( CCPBKDFAlgorithm algorithm, const char *password, size_t passwordLen,
                      const uint8_t *salt, size_t saltLen,
                      CCPseudoRandomAlgorithm prf, uint rounds,
                      uint8_t *derivedKey, size_t derivedKeyLen)
```


随机数生成
---

```
CCRNGStatus CCRandomGenerateBytes(void *bytes, size_t count)
```


Symmetric Key Wrap
---

Wrap a symmetric key with a Key Encryption Key (KEK).

```objective-c
int  
CCSymmetricKeyWrap( CCWrappingAlgorithm algorithm,
                   const uint8_t *iv, const size_t ivLen,
                   const uint8_t *kek, size_t kekLen,
                   const uint8_t *rawKey, size_t rawKeyLen,
                   uint8_t  *wrappedKey, size_t *wrappedKeyLen)
```


第三方库
---

- <https://github.com/kelp404/CocoaSecurity>


