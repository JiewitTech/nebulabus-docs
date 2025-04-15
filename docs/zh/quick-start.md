# 快速开始

这个页面将帮助你快速上手。

## 安装
Nuget: https://www.nuget.org/packages/NebulaBus/#readme-body-tab
**VS包管理器安装**
直接在vs包管理器中搜索NabulaBus，然后安装。

**dotnet cli**

```
dotnet add package NebulaBus
```

**Package Manager**

```
NuGet\Install-Package NebulaBus
```

## 使用

**创建订阅Handler**
```C#
public class TestHandlerV1 : NebulaHandler<TestMessage>
{
    //订阅者唯一标识，用于定向发送
    public override string Name => "NebulaBus.TestHandler.V1";
    //订阅者组，用于广播，相同组的订阅都将收到消息
    public override string Group => "NebulaBus.TestHandler";
    //重试延迟，用于配置首次失败后多久重试，默认5秒
    public override TimeSpan RetryDelay => TimeSpan.FromSeconds(10);
    //最大重试次数，默认10次
    public override int MaxRetryCount => 5;
    //重试间隔，默认10秒
    public override TimeSpan RetryInterval => TimeSpan.FromSeconds(10);

    protected override async Task Handle(TestMessage message, NebulaHeader header)
    {
        Console.WriteLine($"{DateTime.Now} Received Message {Name}:{message.Message} Header:{header["customHeader"]} RetryCount:{header[NebulaHeader.RetryCount]}");
        //TODO: your logic code
    }
}
```
**注册NebulaBus**
```C#
builder.Services.AddNebulaBus(options =>
{
    //集群名称，它是可选的，默认为程序集名称
    options.ClusterName = "TestCluster";
    options.UseRabbitmq(rabbitmq =>
    {
        rabbitmq.HostName = “localhost”;
        rabbitmq.UserName = “guest”;
        rabbitmq.Password = “guest”;
        rabbitmq.VirtualHost = "/";
    });
});
```

**注册订阅者 Handler**
```C#
//一个个注册
builder.Services.AddNebulaBusHandler<TestHandlerV1, TestMessage>();
builder.Services.AddNebulaBusHandler<TestHandlerV2, TestMessage>();
builder.Services.AddNebulaBusHandler<TestHandlerV3>();

//批量注册
builder.Services.AddNebulaBusHandler(typeof(TestHandlerV1).Assembly);
```

**广播**

```C#
//INebulaBus 接口
private readonly INebulaBus _bus;

//广播传入的是订阅者组名，所有相同组的订阅者都将收到消息
_bus.PublishAsync("NebulaBus.TestHandler", new TestMessage { Message = "Hello World" });
```

**延迟广播**

```C#
//INebulaBus 接口
private readonly INebulaBus _bus;

//广播传入的是订阅者组名，所有相同组的订阅者都将收到消息
_bus.PublishAsync(TimeSpan.FromSeconds(5), "NebulaBus.TestHandler", new TestMessage { Message = "Hello World" });
```
**定向发送**

```C#
//INebulaBus 接口
private readonly INebulaBus _bus;

//定向发送传入的是订阅者Name，只有该Name的订阅者会收到消息
_bus.PublishAsync("NebulaBus.TestHandler.V1", new TestMessage { Message = "Hello World" });
```
**延迟定向发送**

```C#
//INebulaBus 接口
private readonly INebulaBus _bus;

_bus.PublishAsync(TimeSpan.FromSeconds(5), "NebulaBus.TestHandler.V1",new TestMessage { Message = "Hello World" });
```
