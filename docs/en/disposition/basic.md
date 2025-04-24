# Basic Disposition
This page will provide detailed instructions on how to configure the basic parameters of NebulaBus.

## Basic Disposition
The basic configuration refers to the fundamental parameters of Nebula Bus, which will affect its global behavior.
Taking. net8 Asp.net WebApi as an example, the basic configuration is as follows:

```csharp
builder.Services.AddNebulaBus(options =>
{
    options.ClusterName = "SampleCluster";
    options.ExecuteThreadCount = 1;
    options.JsonSerializerOptions = new JsonSerializerOptions();
    options.Use**Transport();
    options.Use**Store();
});

//注入Handler
builder.Services.AddNebulaBusHandler(typeof(TestHandlerV1).Assembly);
```

## Describe
**The AddNebulaBus method passes in Action \<NebulaOptions \>, so NebulaOptions can be configured with the following parameters**

- ClusterName：Cluster name, default to the assembly name of the startup program, is used to isolate cluster storage. If the cluster names are the same, NebulaBus will use the same storage. If the cluster names are different, NebulaBus will use different storage. This parameter is invalid for how to use memory storage because independent processes do not share memory. We do not recommend using memory storage in large distributed microservices because memory storage cannot persist data and data will be lost if the program crashes.
- ExecuteThreadCount：The default is the number of processors, indicating the number of executing threads. If set to 1, it means using one thread. When this value is greater than 1, the order of data consumption cannot be guaranteed.
- JsonSerializerOptions：Serialize configuration, using System.Text.Json

### Transport
NebulaBus must specify a transport method, using Use * * Transport, where the \ * \ * symbol represents the specific transport method. Currently, NebulaBus supports memory transfer and RabbitMQ transfer, such as using memory transfer and RabbitMQ transfer methods:

```csharp
//Memory
options.UseMemoryTransport();
//Rabbitmq
options.UseRabbitmqTransport();
```
We do not recommend using memory transfer in production environments because the data transferred from memory will be lost when the application is closed. Detailed configuration about transfer will be introduced in the transfer section.

### Store

The function of storage is to persist delayed data, including retry data, because retry messages are also a type of delayed data in a sense, based on the number of retries and retry intervals. The usage method is User * * Store, where the \ * \ * symbol represents the specific storage method. Currently, NebulaBus supports memory storage and Redis storage, for example, using memory storage and RabbitMQ storage methods as follows

```csharp
//Memory
options.UseMemoryStore();
//Redis
options.UseRedisStore();
```
**NebulaBus requires at least one storage and transmission configuration.**

We do not recommend using memory storage in production environments because the data stored in memory will be lost when the application is closed. Detailed configuration of storage will be introduced in the storage section.

### NebulaBus supports multiple transfers simultaneously, but can only use one storage. Currently, it only supports memory and Redis storage, as well as memory and RabbitMQ transfers. In the future, NebulaBus will support more transfers and storage, such as SQL Kafka， Please follow our updates.
