# Memory Store
This page will provide a detailed introduction to the memory storage of NebulaBus.

## Configuration
To configure NebulaBus to use memory storage, please install the Nuget package NebulaBus.Store.Memory:

```shell
dotnet add package NebulaBus.Store.Memory
```

Then use the following code to add memory storage:
```csharp
options.UseMemoryStore();
```

Specific examples can refer to:
> https://github.com/JiewitTech/NebulaBus/tree/main/src/Samples/FullMemoryWebApiSample