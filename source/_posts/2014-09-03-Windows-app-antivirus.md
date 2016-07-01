---
layout: post
title: "Windows程序免杀的分析"
date: 2014-09-03 20:11:48 +0800
comments: true
categories: VC
tags: Antivirus
---
最近公司开发的Windows软件总是被360检出病毒，特别恼火。总结了几种方法。  

## 1. 程序数字签名 ##
基本上在第一轮和杀毒软件的PK中绝大多数是会通过的，但是在程序中包含特征码那另当别论，杀毒软件立即会报毒。  

## 2. 编译器选项 ##
在VC++里有`#pragma code_seg("PAGE")`//其中PAGE是区段的名称。这个是免杀中最有用的一个编译器选项，它可以把cpp文件里的代码放到一个单独的区段里，这样在对付杀毒软件的代码查杀的时候，给我们带来了非常大的方便。

## 3. VC++ 源代码中加入汇编语句 ##
```c++
__asm
{
	nop //汇编指令
	nop
	nop
	nop
}
```

## 4. 加花指令 ##
花指令：其实是一段垃圾代码，和一些乱跳转，但并不影响程序的正常运行。加了花指令后，使一些杀毒软件无法正确识别木马程序，从而达到免杀的效果。
### 加花指令制作过程详解 ###
+ 第一步：配置一个不加壳的木马程序。  
+ 第二步：用OD载入这个木马程序，同时记下入口点的内存地址。  
+ 第三步：向下拉滚动条，找到零区域（也就是可以插入代码的都是0的空白地方）。并记下零区域的起始内存地址。  
+ 第四步：从这个零区域的起始地址开始一句一句的写入我们准备好的花指令代码。  
+ 第五步：花指令写完后，在花指令的结束位置加一句：JMP　刚才OD载入时的入口点内存地址。  
+ 第六步：保存修改结果后，最后用PEditor这款工具打开这个改过后的木马程序。在入口点处把原来的入口地址改成刚才记下的零区域的起始内存地址，并按应用更改。使更改生效。  

### 加花指令免杀技术总结 ###
优点：通用性非常不错，一般一个木马程序加入花指令后，就可以躲大部分的杀毒软件，不像改特征码，只能躲过某一种杀毒软件。

缺点：这种方法还是不能过具有内存查杀的杀毒软件，比如瑞星内存查杀等。

以后将加花指令与改入口点，加壳，改特征码这几种方法结合起来混合使用效果将非常不错。

### 加花指令免杀要点 ###

由于黑客网站公布的花指令过不了一段时间就会被杀软辨认出来，所以需要你自己去搜集一些不常用的花指令，另外目前还有几款软件可以自动帮你加花，方便一些不熟悉的朋友，例如花指令添加器等。
<!--more-->

### 常见花指令代码 ###

#### 1. VC++ 5.0 ####
```
PUSH EBP
MOV EBP,ESP
PUSH -1
push 515448
PUSH 6021A8
MOV EAX,DWORD PTR FS:[0]
PUSH EAX
MOV DWORD PTR FS:[0],ESP
ADD ESP,-6C
PUSH EBX
PUSH ESI
PUSH EDI
jmp 跳转到程序原来的入口点
```
#### 2. C++ ####
```
push ebp
mov ebp,esp
push -1
push 111111
push 222222
mov eax,fs:[0]
push eax
mov fs:[0],esp
pop eax
mov fs:[0],eax
pop eax
pop eax
pop eax
pop eax
mov ebp,eax
jmp 跳转到程序原来的入口点
```
#### 3. 跳转 ####
```
somewhere:
      nop                    /"胡乱"跳转的开始...
      jmp 下一个jmp的地址    /在附近随意跳
      jmp ...                /...
      jmp 原入口的地址      /跳到原始oep
新入口: push ebp
        mov ebp,esp
        inc ecx
        push edx
        nop
        pop edx
        dec ecx
        pop ebp
        inc ecx
        loop somewhere        /跳转到上面那段代码地址去！
```
#### 4. Microsoft Visual C++ 6.0 ####
```
push ebp
mov ebp,esp
PUSH -1
PUSH 0
PUSH 0
MOV EAX,DWORD PTR FS:[0]
PUSH EAX
MOV DWORD PTR FS:[0],ESP
SUB ESP,68
PUSH EBX
PUSH ESI
PUSH EDI
POP EAX
POP EAX
POP EAX
ADD ESP,68
POP EAX
MOV DWORD PTR FS:[0],EAX
POP EAX
POP EAX
POP EAX
POP EAX
MOV EBP,EAX
JMP 原入口
```
#### 5.在`mov ebp,eax`后面加上`PUSH EAX` `POP EAX` ####
#### 6. ####
```
push ebp
mov ebp,esp
add esp,-0C
add esp,0C
mov eax,403D7D
push eax
retn

push ebp
mov ebp,esp
push -1
push 00411222
push 00411544
mov eax,dword ptr fs:[0]
push eax
mov dword ptr fs:[0],esp
add esp,-6C
push ebx
push esi
push edi
add byte ptr ds:[eax],al
jo 入口
jno 入口
call 下一地址
```
#### 7. ####
```
push ebp
nop
nop
mov ebp,esp
inc ecx
nop
push edx
nop
nop
pop edx
nop
pop ebp
inc ecx
loop 任意地址
nop
nop
nop
nop
jmp 下一个jmp的地址    /在附近随意跳
nop
jmp 下一个jmp的地址    /在附近随意跳
nop
jmp 下一个jmp的地址    /在附近随意跳
jmp 入口
```
