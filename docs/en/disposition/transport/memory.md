# 内存传输
This page will provide a detailed introduction to the memory transport of NebulaBus.

## 配置
To configure NebulaBus to use memory transfer, please install the Nuget package NebulaBus.Transport.Memory:

```shell
dotnet add package NebulaBus.Transport.Memory
```

Then use the following code to add memory transport:

```csharp
options.UseMemoryTransport();
```

Specific examples can refer to:
> https://github.com/JiewitTech/NebulaBus/tree/main/src/Samples/FullMemoryWebApiSample