# 内存传输
这个页面将详细介绍NebulaBus的Rabbitmq传输。

## 配置
要配置NebulaBus使用Rabbitmq传输，请安装Nuget包 NebulaBus.Transport.Rabbitmq:
```shell
dotnet add package NebulaBus.Transport.Rabbitmq
```

然后使用如下代码添加内存传输：
```csharp
options.UseRabbitmqTransport();
```
