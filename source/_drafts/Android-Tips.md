title: Android Tips
tags: Tips
categories: Android
---

## Android Studio

### Android Studio 启动模拟器无法启动

> emulator: ERROR: Unfortunately, there's an incompatibility between HAXM hypervisor and VirtualBox 4.3.30+ which doesn't allow multiple hypervisors to co-exist.  It is being actively worked on; you can find out more about the issue at http://b.android.com/197915 (Android) and https://www.virtualbox.org/ticket/14294 (VirtualBox)

解决办法：可能是启动了 Docker，Docker 运行着 VirtualBox 实例，关闭 Docker 即可。


