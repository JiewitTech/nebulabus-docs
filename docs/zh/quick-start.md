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

## 配置

**Crete subscribe handler**
```
public class TestHandlerV1 : NebulaHandler<TestMessage>
{
    //Unique identifier for subscribers, used for targeted sending
    public override string Name => "NebulaBus.TestHandler.V1";
    //Subscriber group, used for broadcasting, subscribers in the same group will receive messages
    public override string Group => "NebulaBus.TestHandler";
    //Retry delay, used to configure how long to retry after the first failure, default to 10 seconds if not overridden
    public override TimeSpan RetryDelay => TimeSpan.FromSeconds(10);
    //最大重试次数，若不重写则默认10次
    public override int MaxRetryCount => 5;
    //重试间隔，若不重写则默认10秒
    public override TimeSpan RetryInterval => TimeSpan.FromSeconds(10);

    protected override async Task Handle(TestMessage message, NebulaHeader header)
    {
        Console.WriteLine($"{DateTime.Now} Received Message {Name}:{message.Message} Header:{header["customHeader"]} RetryCount:{header[NebulaHeader.RetryCount]}");
        //TODO: your code
    }
}
```

```
builder.Services.AddNebulaBus(options =>
{
    options.ClusterName = "TestCluster";
    options.UseRabbitmq(rabbitmq =>
    {
        rabbitmq.HostName = “localhost”;
        rabbitmq.UserName = “guest”;
        rabbitmq.Password = “guest”;
        rabbitmq.VirtualHost = "/";
    });
});

builder.Services.AddNebulaBusHandler<TestHandlerV1, TestMessage>();
builder.Services.AddNebulaBusHandler<TestHandlerV2, TestMessage>();
```

**Output**

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

## More

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).
