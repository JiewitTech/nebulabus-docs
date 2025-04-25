# Message

This page will introduce the NebulaBus message mechanism in detail.

## Send a message

The message sent by INebulaBus is a message, let's take a look at its statement:

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


Isn't it simple, it only has four overload methods, corresponding to four ways to send messages. In order to serialize the requirements, we add a generic constraint that requires that the message must be class and must implement the new() method, otherwise it cannot be deserialized.

## Subscribe to messages

To subscribe to messages, all you need to do is implement the NebulaHandler<> abstract class, and here's an example of a Handler with a full configuration:

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

    public TestHandlerV1(INebulaBus nebulaBus)
    {
        _bus = nebulaBus;
    }

    protected override async Task Handle(TestMessage message, NebulaHeader header)
    {
        Console.WriteLine(\$"{DateTime.Now} [{Name}] [{nameof(TestHandlerV1)}]Received Message :{message.Message} RetryCount {header.GetRetryCount()}");
    }

    protected override async Task FallBackHandler(TestMessage? message, NebulaHeader header, Exception exception)
    {

    }
}
```

His configuration parameters are as follows:
- Name: The name of the Handler, used to identify the Handler. It is recommended to use a unique one for directed sending.
- Group: Handler's group, used to identify the Handler group and broadcast user messages.
- RetroDelay: The default delay time for the first message retry is 5 seconds.
- MaxRetryCount: The maximum number of message retries is 10 by default. When the Handler encounters an error, it will immediately retry 3 times. This configuration is the maximum number of retries after these three retries.
- RetroInterval: Message retry interval, default is 10 seconds.
- ExecuteThreadCount: The number of message processing threads, default to null. If set to null, the globally configured thread count will be used.

A classmate noticed that it also has a rewriting method FallBackHandler, which I will introduce below.


## Broadcast and directed message sending
The above four methods all support broadcasting messages, which are sent to all subscribers, depending on the nameOrGroup parameter you pass in. If the incoming nameOrGroup is a group, the message will be sent to all subscribers within the group. If the incoming name is a name, the message will be sent to a subscriber with the same message name. For example, if you define two handlers as follows:

```csharp
public class TestHandlerV3 : NebulaHandler
{
    public override string Name => "NebulaBus.TestHandler.V3";
    public override string Group => "NebulaBus.TestHandler";
    public override byte? ExecuteThreadCount => 4;

    protected override async Task Handle(TestMessage message, NebulaHeader header)
    {
        Console.WriteLine(\$"{DateTime.Now} [{Name}] [{nameof(TestHandlerV3)}]Received Message :{message.Message} RetryCount {header.GetRetryCount()}");
    }
}


public class TestHandlerV4 : NebulaHandler<TestMessage>
{
    public override string Name => "NebulaBus.TestHandler.V4";
    public override string Group => "NebulaBus.TestHandler";
    public override byte? ExecuteThreadCount => 4;

    protected override async Task Handle(TestMessage message, NebulaHeader header)
    {
        Console.WriteLine(\$"{DateTime.Now} [{Name}]Received Message :{message.Message} RetryCount {header.GetRetryCount()}");
    }
}
```

Both of the above handlers have subscribed to Nebula Bus The TestHandler group, when using the following method to send messages, because we passed in the group name NebulaBus TestHandler means that both handlers will receive a message.

```csharp
await _bus.PublishAsync("NebulaBus.TestHandler", new TestMessage { Message = "Hello World" });
```

But the name of the first Handler is Nebula Bus TestHandler.V3， The name of the second Handler is Nebula Bus TestHandler.V4， If we use the following method to send a message, only the first Handler will receive the message because we pass in the Handler's Name, not the group name.

```csharp
await _bus.PublishAsync("NebulaBus.TestHandler.V3", new TestMessage { Message = "Hello World" });
```

Additionally, if we use the same Name in different groups, only one Handler will receive the message because Name is unique. But we don't recommend defining it this way. I suggest defining a unique Name for each Handler (using the Handler type name as the Name for convenience), which is easier to manage, and you also need to ensure that your Message type is consistent, otherwise serialization issues may occur.

## Delay message
Whether it's broadcasting or targeted sending of messages, Nebula Bus supports delayed messages, and subscribers will receive messages after the delay time. You can use the following method to send delayed messages:

```csharp
await _bus.PublishAsync(TimeSpan.FromSeconds(5), "NebulaBus.TestHandler.V3", new TestMessage { Message = "Hello World" });
```
Just pass in a delay time, the longer the delay time, the later the message is sent.

## Message Header
NebulaBus supports the message header NebulaHeader, which is a dictionary. We provide built-in key value pairs, and you can add some custom information to the message header. Here are the built-in key value pairs:

- NebulaHeader.RequestId： Request Id, used to track requests. If you pass in this key value pair, it will be based on what you pass in. If you do not pass it, a random UID will be generated.
- NebulaHeader.MessageId： Message Id, used to track messages, each sent message will create a unique Id, which cannot be overwritten. NebulaBus uses Snowflake The Core Snowflake algorithm generates a Message ID. For details, please refer to: https://github.com/stulzq/snowflake-net .
- NebulaHeader.RetryCount： The number of retries, if the message fails, Nebula Bus will automatically retry, with a default retry count of 10 times.
- NebulaHeader.Sender: Sender, used to record the information of the message sender, its value format is {machine name} {Assembly Name}
- NebulaHeader. Consumer： Consumer, used to record information about message recipients, its value format is {machine name} {Assembly Name}
- NebulaHeader.SendTimeStamp： Sending time, used to record the time of message sending, its value is UTC timestamp, and the unit is seconds.
- NebulaHeader.Exception:   Exception information, used to record the exception information when a message fails to be sent, and its value is the result of the exception's Json().
- NebulaHeader.MessageType:   Message type, used to record the type of message, its value is the type name of the message, for example: NebulaBus.TestMessage。
- NebulaHeader.Name:  The subscriber name is the unique name of the subscriber you have configured
- NebulaHeader.Group:  The subscriber group is the name of the subscriber group you have configured

Here is an example of sending a message with a header:

```csharp
await _bus.PublishAsync("NebulaBus.TestHandler.V3", new TestMessage { Message = "Hello World" }, new Dictionary()
{
    {NebulaHeader.RequestId , Guid.NewGuid().ToString()}, //Specify RequestId
    {"TestHeaderKey" , "TestHeaderValue"}  //Customize message header
})
```

TestHandler V3 will receive a message with a RequestId and a custom TestHeaderKey in the message header.

```csharp
public class TestHandlerV3 : NebulaHandler
{
    public override string Name => "NebulaBus.TestHandler.V3";
    public override string Group => "NebulaBus.TestHandler";
    public override byte? ExecuteThreadCount => 4;

    protected override async Task Handle(TestMessage message, NebulaHeader header)
    {
        Console.WriteLine(\$"{DateTime.Now} [{Name}] [{nameof(TestHandlerV3)}]Received Message :{message.Message} RetryCount {header.GetRetryCount()}");
        var requestId = header.GetRequestId();
        var messageId = header.GetMessageId();
        var testHeaderValue = header["TestHeaderKey"];
    }
}
```

## Message retry

NebulaBus supports message retry. When message processing fails, NebulaBus will immediately retry 3 times and then retry after the configured delay time. The default retry count is 10 times, and you can set the retry count in the Handler. When the retry attempts still fail, you can handle the failed message in FallBackHandler. The third parameter of this method is Exception, which represents the exception information at the time of failure. Please refer to the filter section for details.

```csharp
protected override async Task FallBackHandler(TestMessage? message, NebulaHeader header, Exception exception)
{

}
```

All retry messages and delay messages are scheduled by the built-in Quartz.Net scheduled tasks, and NebulaBus has built-in Quartz.Net, so you don't need to care about its configuration.

Specific examples can refer to:
> https://github.com/JiewitTech/NebulaBus/tree/main/src/Samples/LogicSamples/Handlers