# 内存存储
这个页面将详细介绍NebulaBus的内存存储。

## 配置
要配置NebulaBus使用内存存储，请安装Nuget包 NebulaBus.Store.Memory:

```shell
dotnet add package NebulaBus.Store.Memory
```

然后使用如下代码添加内存存储：
```csharp
options.UseMemoryStore();
```

具体示例可参考：
> https://github.com/JiewitTech/NebulaBus/tree/main/src/Samples/FullMemoryWebApiSample