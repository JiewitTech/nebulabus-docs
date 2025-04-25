# Filter
This page will provide a detailed introduction to the NebulaBus message filter.

## Describe
NebulaHandler\<\> has three rewritable methods that you can override within the Handler:

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
- BeforeHandle: Execute before the Handler method, it has a boolean return value. If it returns false, it means the Handler method will no longer be executed
- AfterHandle: Execute after the Handler method is executed
- FallBackHandle: Execute after the Handler method ultimately fails, with the third parameter 'exception' indicating the exception that caused the failure

Using filters can easily add logs or record execution status for handlers. You can refer to the following example:
> https://github.com/JiewitTech/NebulaBus/blob/main/src/Samples/LogicSamples/Handlers/TestFilterHandler.cs

## Global Filter
NebulaBus can configure a global filter that takes effect when the Handler does not implement the filter. The priority of the filter is Handler Filter \>Global Filter.
You only need to implement the INebulaFilter interface:

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

Then add a filter in the StartUp or Program method:

```csharp
builder.Services.AddNebulaBusFilter<GlobalHandlerFilter>();
```

An example of a global filter can refer to:
> https://github.com/JiewitTech/NebulaBus/blob/main/src/Samples/LogicSamples/GlobalHandlerFilter.cs