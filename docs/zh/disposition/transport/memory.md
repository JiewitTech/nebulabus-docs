# 内存传输
这个页面将详细介绍NebulaBus的内存传输。

## 配置
要配置NebulaBus使用内存传输，请安装Nuget包 NebulaBus.Transport.Memory:
```shell
dotnet add package NebulaBus.Transport.Memory
```

然后使用如下代码添加内存传输：
```csharp
options.UseMemoryTransport();
```

具体示例可参考：
> https://github.com/JiewitTech/NebulaBus/tree/main/src/Samples/FullMemoryWebApiSample