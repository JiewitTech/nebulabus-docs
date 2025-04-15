# 配置
这个页面将详细介绍如何根据你的实际情况配置NebulaBus。

## 最低配置
所谓最低配置，是指NebulaBus最少需要配置的参数，你只需要配置一个Rabbitmq传输即可，NebulaBus将使用内存作为缓存。
以.net8 Asp.net WebApi 为例，最低配置如下：

```csharp
builder.Services.AddNebulaBus(options =>
{
    options.UseRabbitmq(rabbitmq =>
    {
        rabbitmq.HostName = “localhost”;
        rabbitmq.UserName = “guest”;
        rabbitmq.Password = “guest”;
        rabbitmq.VirtualHost = "/";
    });
});

//注入Handler
builder.Services.AddNebulaBusHandler(typeof(TestHandlerV1).Assembly);
```

## 详细配置
**AddNebulaBus 方法传入的是Action\<NebulaOptions\>，因此NebulaOptions可配置参数如下**

- ClusterName：集群名称，默认为启动程序的程序集名称，它用于隔离集群存储，如果集群名称相同，则NebulaBus将使用相同的存储，如果集群名称不同，则NebulaBus将使用不同的存储，如何使用内存存储则该参数无效，因为独立进程之间不会共享内存，我们不推荐在大型分布式微服务中使用内存存储，因为内存存储无法持久化数据，如果程序崩溃，则数据将丢失。
- ExecuteThreadCount：默认为处理器数，表示执行线程数量，如果设置为1，则表示使用1个线程，当该值大于1时将不能保证数据消费的顺序。
- JsonSerializerOptions：序列化器配置，使用System.Text.Json

### 传输
**如果使用Rabbitmq作为传输，则需要配置RabbitmqOptions**
UseRabbitmq 方法传入的是Action\<RabbitmqOptions\>，因此RabbitmqOptions可配置参数如下

- UserName：rabbitmq用户名，默认为guest
- Password：rabbitmq密码，默认为guest
- HostName：rabbitmq主机名，默认为localhost，如果是集群模式，则需要配置多个HostName，以逗号分隔
- VirtualHost：rabbitmq虚拟主机，默认为/
- Port：rabbitmq端口，默认为5672
- ExchangeName: rabbitmq交换机名，默认为nebula-bus-exchange
- SslOption: Rabbitmq SSL配置，默认为null，如何使用SSL，请自行参考Rabbitmq.NET Client文档。
- Qos: Rabbitmq Qos配置，默认为0表示不限制，如何使用Qos，请自行参考Rabbitmq.NET Client文档。
- GetQos：这是Func\<string, string, ushort\> 类型，表示获取Qos的函数，默认为null，第一个参数为Handler 的Name，第二个参数Handler Group,可批量为不同的Handler配置不同的Qos

### 存储
**如果使用RedisStore作为存储，则需要配置RedisStoreOptions**

存储的作用是为了持久化延迟数据，包括重试数据，因为重试消息根据重试次数和重试间隔，他从某种意义上来说也是一种延迟数据，如果不使用Redis存储则NebulaBus将默认使用内存存储，因此如果程序崩溃，则数据将丢失。
UseRedisStore 方法传入的是Redis连接字符串
字符串格式为："127.0.0.1:6379,password=******,defaultDatabase=0"，如果是集群模式，则需要配置多个Redis连接字符串，以分号;分隔。
由于NebulaBus使用FreeRedis作为Redis客户端，因此更多参数请自行参考FreerRedis文档：https://github.com/2881099/FreeRedis

### 未来NebulaBus将支持更多的传输和存储，如Kafka、Redis等，请关注我们的更新。