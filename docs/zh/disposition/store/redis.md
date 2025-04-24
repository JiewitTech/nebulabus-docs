# Redis存储
这个页面将详细介绍NebulaBus的Redis存储。

## 配置
要配置NebulaBus使用Redis存储，请安装Nuget包 NebulaBus.Store.Redis:

```shell
dotnet add package NebulaBus.Store.Redis
```

然后使用如下代码添加Redis存储：
```csharp
options.UseRedisStore("");
```
UseRedisStore 方法传入的是Redis连接字符串
字符串格式为："127.0.0.1:6379,password=******,defaultDatabase=0"，如果是集群模式，则需要配置多个Redis连接字符串，以分号\;分隔。
由于NebulaBus使用FreeRedis作为Redis客户端，因此更多参数请自行参考FreerRedis文档：https://github.com/2881099/FreeRedis