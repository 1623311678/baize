# 白泽

一体化前端监控平台

## 如何使用

#### 1. 安装

```shell
npm install @hun-dun/monitor-sdk
```

### 2. 引入&初始化

```javascript
// vue 或者react项目，入口文件内
// 如main.ts

import MonitoringSDK from "@hun-dun/monitor-sdk";

const Monitor = new MonitoringSDK({ domain: "http://localhost:3001" });

window.Monitor = Monitor;
// domain 是服务端部署的地址，

// 如何手动上报？
/*
* type :类型：javascript｜resource
* level: 级别：error｜warn｜info
* message: 信息,字符串
*/
const monitor: any = window.Monitor;
monitor.report({
  message: "自定义上报异常",
  type: "javascript",
  level: "warn",
});
```

### 3. 启动前端

进入 client 目录 npm install 安装依赖，npm start 启动前端,需要 node14 环境

### 4. 启动docker与准备工作

安装docker，docker 客户端下载 https://www.docker.com/ 之后安装mysql，redis 的镜像

如果想项目跑起来，需要先启动 docker 内的 mysql 和 redis ，默认端口即可 之后在 mysql 内创建 monitor 表

1、 docker ps

2、docker exec -it my-mysql mysql -uroot -proot

3、创建表 monitor

CREATE DATABASE IF NOT EXISTS monitor;


### 5. 启动服务端

进入 server 目录 npm install 安装依赖，npm start 启动服务端，需要 node16 以上环境

## 目录介绍

1. client

前端示例代码，需要 node14 环境,包括登陆验证，用户注册，列表查询等

包括异常上报，PV，UV，手动上报

2. server

服务端代码，包括登陆验证，用户注册，列表查询等，redis 缓存，mysql 数据库，JWT Token 等 需要 node16 以上的环境

3. sdk

前端监控 sdk


### 简单介绍

#### 1.操作

![alt text](./demo/image.png)

#### 2.告警信息

![alt text](./demo/image2.png)

#### 3.PV

![alt text](./demo/image3.png)

#### 4.UV

![alt text](./demo/image4.png)
