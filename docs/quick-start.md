# Quick Start

This page will help you get started quickly.

## Install
Nuget: https://www.nuget.org/packages/NebulaBus/#readme-body-tab

**VS Package Manager Installation**

Search for NebulaBus directly in the VS package manager and install it.

**dotnet cli**

```
dotnet add package NebulaBus
```

**Package Manager**

```
NuGet\Install-Package NebulaBus
```

## Use

**Crete subscribe handler**
```
public class TestHandlerV1 : NebulaHandler<TestMessage>
{
    //Unique identifier for subscribers, used for targeted sending
    public override string Name => "NebulaBus.TestHandler.V1";
    //Subscriber group, used for broadcasting, subscribers in the same group will receive messages
    public override string Group => "NebulaBus.TestHandler";
    //Retry delay, used to configure how long to retry after the first failure, default to 5 seconds
    public override TimeSpan RetryDelay => TimeSpan.FromSeconds(10);
    //The maximum number of retries, defaults to 10 times
    public override int MaxRetryCount => 5;
    //Retry interval, defaults to 10 seconds
    public override TimeSpan RetryInterval => TimeSpan.FromSeconds(10);

    protected override async Task Handle(TestMessage message, NebulaHeader header)
    {
        Console.WriteLine($"{DateTime.Now} Received Message {Name}:{message.Message} Header:{header["customHeader"]} RetryCount:{header[NebulaHeader.RetryCount]}");
        //TODO: your logic code
    }
}
```
**Register NebulaBus**
```
builder.Services.AddNebulaBus(options =>
{
    //Cluster name, it's optional
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

**Register Handler**
```C#
//Register one by one
builder.Services.AddNebulaBusHandler<TestHandlerV1, TestMessage>();
builder.Services.AddNebulaBusHandler<TestHandlerV2, TestMessage>();
builder.Services.AddNebulaBusHandler<TestHandlerV3>();

//Batch Registration
builder.Services.AddNebulaBusHandler(typeof(TestHandlerV1).Assembly);
```

**Broadcast**

```C#
//INebulaBus interface injected
private readonly INebulaBus _bus;

_bus.PublishAsync("NebulaBus.TestHandler", new TestMessage { Message = "Hello World" });
```

**Delay Broadcast**

```C#
//INebulaBus interface
private readonly INebulaBus _bus;

//Broadcast, the incoming message is the subscriber group, and all subscribers in the same group will receive the message
_bus.PublishAsync(TimeSpan.FromSeconds(5), "NebulaBus.TestHandler", new TestMessage { Message = "Hello World" });
```
**Directed sending**

```C#
//INebulaBus interface
private readonly INebulaBus _bus;

//The incoming message is directed to the subscriber name, and only subscribers with that name will receive the message
_bus.PublishAsync("NebulaBus.TestHandler.V1", new TestMessage { Message = "Hello World" });
```
**Delay Directed sending**

```C#
//INebulaBus interface
private readonly INebulaBus _bus;

_bus.PublishAsync(TimeSpan.FromSeconds(5), "NebulaBus.TestHandler.V1",new TestMessage { Message = "Hello World" });
```


