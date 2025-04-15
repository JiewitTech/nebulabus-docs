# 消息
这个页面将详细介绍NebulaBus消息机制。

## 发送消息
使用INebulaBus发送出去的Message就是消息，让我们看下它的声明：
```csharp
public interface INebulaBus
{
    Task PublishAsync<T>(string nameOrGroup, T message) where T : class, new();
    Task PublishAsync<T>(string nameOrGroup, T message, IDictionary<string, string> headers) where T : class, new();
    Task PublishAsync<T>(TimeSpan delay, string nameOrGroup, T message) where T : class, new();
    Task PublishAsync<T>(TimeSpan delay, string nameOrGroup, T message, IDictionary<string, string> headers)
        where T : class, new();
}
```
是不是很简单，它只有四个重载方法，分别对应了四种消息发送方式。为了序列化要求，我们加了一个泛型约束，要求消息必须是class且必须实现new()方法，否则无法反序列化。

## 订阅消息

要订阅消息，只需要实现NebulaHandler<>抽象类即可，下面是一个附带完整配置的Handler例子：
```csharp
public class TestHandlerV1 : NebulaHandler<TestMessage>
{
    public override string Name => "NebulaBus.TestHandler.V1";
    public override string Group => "NebulaBus.TestHandler";
    public override TimeSpan RetryDelay => TimeSpan.FromSeconds(10);
    public override int MaxRetryCount => 5;
    public override TimeSpan RetryInterval => TimeSpan.FromSeconds(10);
    public override byte? ExecuteThreadCount => 2;

    private readonly INebulaBus _bus;
    public int TestValue = 2;

    public TestHandlerV1(INebulaBus nebulaBus)
    {
        _bus = nebulaBus;
    }

    protected override async Task Handle(TestMessage message, NebulaHeader header)
    {
        Console.WriteLine($"{DateTime.Now} [{Name}] [{nameof(TestHandlerV1)}]Received Message :{message.Message} RetryCount {header.GetRetryCount()}");
        TestValue = 3;
    }

    protected override async Task FallBackHandler(TestMessage? message, NebulaHeader header, Exception exception)
    {
        
    }
}
```
他的配置参数如下：
- Name：Handler的名称，用于标识Handler，建议使用唯一的，用于定向发送。
- Group：Handler的组，用于标识Handler组，用户消息广播。
- RetryDelay：消息首次重试的延迟时间，默认为10秒。
- MaxRetryCount：消息最大重试次数，默认为5次。
- RetryInterval：消息重试间隔时间，默认为10秒。
- ExecuteThreadCount：消息处理线程数，默认为null，如果设置为null，则使用全局配置的线程数。

有同学注意到它还有一个重写方法FallBackHandler，下面我会介绍到它。


## 广播和定向发送消息
上面的四个方法均支持广播消息，即发送给所有订阅者，这取决于你传入的nameOrGroup参数。如果传入的nameOrGroup是一个group，那么消息将会发送给组内的所有订阅者，如果传入的是一个name，那么消息将会发送给一个消息名的订阅者。举个例子，如果你定义了两个Handler如下:
```csharp
public class TestHandlerV3 : NebulaHandler<TestMessage>
{
    public override string Name => "NebulaBus.TestHandler.V3";
    public override string Group => "NebulaBus.TestHandler";
    public override byte? ExecuteThreadCount => 4;

    protected override async Task Handle(TestMessage message, NebulaHeader header)
    {
        Console.WriteLine($"{DateTime.Now} [{Name}] [{nameof(TestHandlerV3)}]Received Message :{message.Message} RetryCount {header.GetRetryCount()}");
    }
}   
```

```csharp
public class TestHandlerV4 : NebulaHandler<TestMessage>
{
    public override string Name => "NebulaBus.TestHandler.V4";
    public override string Group => "NebulaBus.TestHandler";
    public override byte? ExecuteThreadCount => 4;

    protected override async Task Handle(TestMessage message, NebulaHeader header)
    {
        Console.WriteLine($"{DateTime.Now} [{Name}]Received Message :{message.Message} RetryCount {header.GetRetryCount()}");
    }
}
```
以上两个Handler都订阅了NebulaBus.TestHandler这个组，如果使用下面的方法发送消息时，因为我们传入的是组名NebulaBus.TestHandler 那么两个Handler都会收到消息。
```csharp
await _bus.PublishAsync("NebulaBus.TestHandler", new TestMessage { Message = "Hello World" });
```
但是第一个Handler的Name是NebulaBus.TestHandler.V3，第二个Handler的Name是NebulaBus.TestHandler.V4，如果我们使用下面的方法发送消息时，只有第一个Handler会收到消息,因为我们传入的是Handler的Name，而不是组名。
```csharp
await _bus.PublishAsync("NebulaBus.TestHandler.V3", new TestMessage { Message = "Hello World" });
```

另外如果我们不同的组里面使用了相同的Name，那么只会有一个Handler收到消息，因为Name是唯一的。但是我们不推荐这么定义，我建议每个Handler都定义一个唯一的Name（为了方便可以使用Handler类型名称作为Name），这样便于管理，而且你也要确保你的Message类型是一致的，否则会出现序列化问题。

## 延迟消息
不管是消息的广播还是定向发送，NebulaBus都支持延迟消息，订阅者将在延迟时间后收到消息，你可以使用下面的方法发送延迟消息：
```csharp
await _bus.PublishAsync(TimeSpan.FromSeconds(5), "NebulaBus.TestHandler.V3", new TestMessage { Message = "Hello World" });  
```
只需要传入一个延迟时间即可，延迟时间越长，消息发送越晚。

## 消息头
NebulaBus支持消息头NebulaHeader，消息头是一个字典，我们提供了内置的键值对，你可以在消息头中添加一些自定义的信息。下面是内置的键值对：

- NebulaHeader.RequestId：请求Id，用于跟踪请求，如果你传入这个键值对则以你传入的为准，如果你不传则会生成一个随机的Guid。
- NebulaHeader.MessageId：消息Id，用于跟踪消息，每条发出的消息都将创建一个唯一的Id，该值不能被覆盖，NebulaBus使用Snowflake.Core雪花算法生成MessageId，详情可以参考：https://github.com/stulzq/snowflake-net。
- NebulaHeader.RetryCount：重试次数，如果消息失败，NebulaBus会自动重试，重试次数默认为10次。
- NebulaHeader.Sender:发送者，用于记录消息发送者的信息，它的值格式为{机器名}.{程序集名称}
- NebulaHeader.Consumer：消费者，用于记录消息接收者的信息，它的值格式为{机器名}.{程序集名称}
- NebulaHeader.SendTimeStamp：发送时间，用于记录消息发送的时间，它的值为UTC时间戳，单位为秒。
- NebulaHeader.Exception:  异常信息，用于记录消息发送失败时的异常信息，它的值为异常的ToString()结果。
- NebulaHeader.MessageType:  消息类型，用于记录消息的类型，它的值为消息的类型名称，例如：NebulaBus.TestMessage。
- NebulaHeader.Name: 订阅者名，它就是你配置的订阅者唯一名称
- NebulaHeader.Group: 订阅者组，它就是你配置的订阅者组名称

下面是发送一个带有消息头的消息的例子：
```csharp
await _bus.PublishAsync("NebulaBus.TestHandler.V3", new TestMessage { Message = "Hello World" }, new Dictionary<string, string>()
{
    {NebulaHeader.RequestId , Guid.NewGuid().ToString()}, //指定RequestId
    {"TestHeaderKey" , "TestHeaderValue"}  //自定义消息头
})
```

TestHandlerV3将收到消息，并且消息头中包含RequestId和自定义的TestHeaderKey。
```csharp
public class TestHandlerV3 : NebulaHandler<TestMessage>
{
    public override string Name => "NebulaBus.TestHandler.V3";
    public override string Group => "NebulaBus.TestHandler";
    public override byte? ExecuteThreadCount => 4;

    protected override async Task Handle(TestMessage message, NebulaHeader header)
    {
        Console.WriteLine($"{DateTime.Now} [{Name}] [{nameof(TestHandlerV3)}]Received Message :{message.Message} RetryCount {header.GetRetryCount()}");
        var requestId = header.GetRequestId();
        var messageId = header.GetMessageId();
        var testHeaderValue = header["TestHeaderKey"];
    }
}   
```

## 消息重试
NebulaBus支持消息重试，当消息处理失败时，NebulaBus会自动重试，重试次数默认为10次，你可以在Handler中设置重试次数。当超出重试次数依然失败时，你可以在FallBackHandler中处理失败的消息，该方法的第三个参数为Exception，表示失败时的异常信息。

```csharp
protected override async Task FallBackHandler(TestMessage? message, NebulaHeader header, Exception exception)
{
    
}
```
所有重试消息和延迟消息都是由内置的Quartz.Net定时任务调度的，NebulaBus内置了Quartz.Net, 你不需要关心它的配置。

