# 基本配置
这个页面将详细介绍如何配置NebulaBus基本参数。

## 基本配置
基本配置即NebulaBus的基本参数，他将影响NebulaBus的全局行为。
以.net8 Asp.net WebApi 为例，基本配置如下：

```csharp
builder.Services.AddNebulaBus(options =>
{
    options.ClusterName = "SampleCluster";
    options.ExecuteThreadCount = 1;
    options.JsonSerializerOptions = new JsonSerializerOptions();
    options.Use**Transport();
    options.Use**Store();
});

//注入Handler
builder.Services.AddNebulaBusHandler(typeof(TestHandlerV1).Assembly);
```

## 说明
**AddNebulaBus 方法传入的是Action\<NebulaOptions\>，因此NebulaOptions可配置参数如下**

- ClusterName：集群名称，默认为启动程序的程序集名称，它用于隔离集群存储，如果集群名称相同，则NebulaBus将使用相同的存储，如果集群名称不同，则NebulaBus将使用不同的存储，如何使用内存存储则该参数无效，因为独立进程之间不会共享内存，我们不推荐在大型分布式微服务中使用内存存储，因为内存存储无法持久化数据，如果程序崩溃，则数据将丢失。
- ExecuteThreadCount：默认为处理器数，表示执行线程数量，如果设置为1，则表示使用1个线程，当该值大于1时将不能保证数据消费的顺序。
- JsonSerializerOptions：序列化器配置，使用System.Text.Json

### 传输
NebulaBus必须指定传输方式，使用方式为Use**Transport，其中\*\*符号表示具体的传输方式，目前NebulaBus支持内存传输和Rabbitmq传输，例如使用内存传输和Rabbitmq传输方式：

```csharp
//Memory
options.UseMemoryTransport();
//Rabbitmq
options.UseRabbitmqTransport();
```
我们不建议在生产环境中使用内存传输，因为当应用程序关闭时内存传输的数据将丢失，关于传输的详细配置将在传输章节具体介绍。

### 存储

存储的作用是为了持久化延迟数据，包括重试数据，因为重试消息根据重试次数和重试间隔，他从某种意义上来说也是一种延迟数据，使用方式为User**Store，其中\*\*符号表示具体的存储方式，目前NebulaBus支持内存存储和Redis存储，例如使用内存存储和Rabbitmq存储方式如下

```csharp
//Memory
options.UseMemoryStore();
//Redis
options.UseRedisStore();
```
**NebulaBus要求至少配置一个存储和传输。**

我们不建议在生产环境中使用内存存储，因为当应用程序关闭时内存存储的数据将丢失，关于存储的详细配置将在存储章节具体介绍。

### NebulaBus支持同时使用多个传输，但只能使用一个存储，目前只支持内存和Redis存储以及内存和Rabbitmq传输，未来NebulaBus将支持更多的传输和存储，如Sql、Kafka，请关注我们的更新。
