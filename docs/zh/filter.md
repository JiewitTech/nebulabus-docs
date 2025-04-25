# 过滤器
这个页面将详细介绍NebulaBus消息过滤器。

## 说明
NebulaHandler\<\> 具有三个可重写方法，你可以在Handler中重写:

```csharp
protected virtual Task<bool> BeforeHandle(T? message, NebulaHeader header)
{
}

protected virtual Task AfterHandle(T? message, NebulaHeader header)
{
}

protected virtual Task FallBackHandle(T? message, NebulaHeader header, Exception exception)
{
}
```
- BeforeHandle: 在Handler方法执行前执行，它有bool返回值，如果返回false表示不再执行Handler方法
- AfterHandle: 在Handler方法执行后执行
- FallBackHandle：在Handler方法执行最终失败后执行，第三个参数exception表示引起失败的异常

使用过滤器可以很方便的为Handler添加日志或记录执行情况。可以参考示例：
> https://github.com/JiewitTech/NebulaBus/blob/main/src/Samples/LogicSamples/Handlers/TestFilterHandler.cs

## 全局过滤器
NebulaBus可以配置一个全局过滤器，当Handler没有实现过滤器时则全局过滤器生效，过滤器的优先级为Handler过滤器\>全局过滤器。
你只需要实现INebulaFilter接口即可：
```csharp
public class GlobalHandlerFilter : INebulaFilter
{
    public async Task<bool> BeforeHandle(object data, NebulaHeader header)
    {
        Console.WriteLine($"{DateTime.Now} GlobalHandlerFilter.BeforeHandle");
        return data switch
        {
            TestMessage msg => await Task.FromResult(true),
            _ => await Task.FromResult(true),
        };
    }

    public async Task AfterHandle(object data, NebulaHeader header)
    {
        Console.WriteLine($"{DateTime.Now} GlobalHandlerFilter.AfterHandle");
    }

    public async Task FallBackHandle(object? data, NebulaHeader header, Exception exception)
    {
        Console.WriteLine($"{DateTime.Now} GlobalHandlerFilter.FallBackHandle");
    }
}
```

然后在StartUp或Program方法中添加过滤器：
```csharp
builder.Services.AddNebulaBusFilter<GlobalHandlerFilter>();
```

全局过滤器的示例可参考：
> https://github.com/JiewitTech/NebulaBus/blob/main/src/Samples/LogicSamples/GlobalHandlerFilter.cs