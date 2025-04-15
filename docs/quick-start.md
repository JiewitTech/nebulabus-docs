# Get started quickly

This page will help you get started quickly.

## Installation

Nuget: [![NuGet Version](https://img.shields.io/nuget/v/NebulaBus?style=plastic&color=blue)](https://www.nuget.org/packages/NebulaBus/)

![NuGet Downloads](https://img.shields.io/nuget/dt/NebulaBus?style=plastic&link=https%3A%2F%2Fwww.nuget.org%2Fpackages%2FNebulaBus)

**VS package manager installation** 

Search for NabulaBus directly in the vs package manager and install it.

**dotnet cli**

dotnet add package NebulaBus


**Package Manager**

NuGet\Install-Package NebulaBus


## use

**Create a Subscription Handler**

```csharp
public class TestHandlerV1 : NebulaHandler<TestMessage>
{
    //Unique identifier for subscribers, used for targeted sending
    public override string Name => "NebulaBus.TestHandler.V1";
    //Subscriber group, used for broadcasting, subscribers in the same group will receive messages
    public override string Group => "NebulaBus.TestHandler";
    //Retry delay, used to configure how long to retry after the first failure, default is 5 seconds
    public override TimeSpan RetryDelay => TimeSpan.FromSeconds(10);
    //Maximum retry times, default 5 times
    public override int MaxRetryCount => 5;
    //Retry interval, default 10 seconds
    public override TimeSpan RetryInterval => TimeSpan.FromSeconds(10);

    protected override async Task Handle(TestMessage message, NebulaHeader header)
    {
        Console.WriteLine(\$"{DateTime.Now} Received Message {Name}:{message.Message} Header:{header["customHeader"]} RetryCount:{header[NebulaHeader.RetryCount]}");
        //TODO: your logic code
    }
}
```


**Sign up for NebulaBus**

```csharp
builder.Services.AddNebulaBus(options =>
{
    //Cluster name, it is optional and defaults to the assembly name
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


**Sign up for the Subscriber Handler**

```csharp
//Register one by one
builder.Services.AddNebulaBusHandler<TestHandlerV1, TestMessage>();
builder.Services.AddNebulaBusHandler<TestHandlerV2, TestMessage>();
builder.Services.AddNebulaBusHandler<TestHandlerV3>();

//Batch registration
builder.Services.AddNebulaBusHandler(typeof(TestHandlerV1).Assembly);
```

**broadcast**

```csharp
//INebulaBus interface
private readonly INebulaBus _bus;

//The broadcast receives the subscriber group name, and all subscribers in the same group will receive the message
_bus.PublishAsync("NebulaBus.TestHandler", new TestMessage { Message = "Hello World" });
```

**Delayed broadcasting**

```csharp
//INebulaBus interface
private readonly INebulaBus _bus;

//The broadcast receives the subscriber group name, and all subscribers in the same group will receive the message
_bus.PublishAsync(TimeSpan.FromSeconds(5), "NebulaBus.TestHandler", new TestMessage { Message = "Hello World" });
```

**Directed sending**

```csharp
//INebulaBus interface
private readonly INebulaBus _bus;

//The incoming message is directed to the subscriber name, and only subscribers with that name will receive the message
_bus.PublishAsync("NebulaBus.TestHandler.V1", new TestMessage { Message = "Hello World" });
```

**Delayed Directed Sending**

```csharp
//INebulaBus interface
private readonly INebulaBus _bus;

_bus.PublishAsync(TimeSpan.FromSeconds(5), "NebulaBus.TestHandler.V1",new TestMessage { Message = "Hello World" });
```

