# Rabbitmq传输
这个页面将详细介绍NebulaBus的Rabbitmq传输。

## 配置
要配置NebulaBus使用Rabbitmq传输，请安装Nuget包 NebulaBus.Transport.Rabbitmq:
```shell
dotnet add package NebulaBus.Transport.Rabbitmq
```

然后使用如下代码添加Rabbitmq传输：
```csharp
options.UseRabbitmqTransport(rabbitmq =>
{
    rabbitmq.HostName = "";
    rabbitmq.UserName = ""
    rabbitmq.Password = "";
    rabbitmq.VirtualHost = "";
});
```

UseRabbitmqTransport 方法传入的是Action\<RabbitmqOptions\>，因此RabbitmqOptions可配置参数如下

- UserName：rabbitmq用户名，默认为guest
- Password：rabbitmq密码，默认为guest
- HostName：rabbitmq主机名，默认为localhost，如果是集群模式，则需要配置多个HostName，以逗号分隔
- VirtualHost：rabbitmq虚拟主机，默认为/
- Port：rabbitmq端口，默认为5672
- ExchangeName: rabbitmq交换机名，默认为nebula-bus-exchange
- SslOption: Rabbitmq SSL配置，默认为null，如何使用SSL，请自行参考Rabbitmq.NET Client文档。
- Qos: Rabbitmq Qos配置，默认为0表示不限制，如何使用Qos，请自行参考Rabbitmq.NET Client文档。
- GetQos：这是Func\<string, string, ushort\> 类型，表示获取Qos的函数，默认为null，第一个参数为Handler 的Name，第二个参数Handler Group,可批量为不同的Handler配置不同的Qos

具体代码示例可以参考：
> https://github.com/JiewitTech/NebulaBus/tree/main/src/Samples/RabbitmqWithRedisStoreWebApiSample