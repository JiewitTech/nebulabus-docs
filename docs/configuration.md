# Disposition

This page will explain in detail how to configure NebulaBus according to your actual situation.

## Minimum configuration

The so-called minimum configuration refers to the minimum parameters that need to be configured for NebulaBus, you only need to configure a Rabbitmq transmission, and NebulaBus will use memory as a cache. Taking .net8 Asp.net WebApi as an example, the minimum configuration is as follows:

```csharp
builder.Services.AddNebulaBus(options =>
{
    options.UseRabbitmq(rabbitmq =>
    {
        rabbitmq.HostName = “localhost”;
        rabbitmq.UserName = “guest”;
        rabbitmq.Password = “guest”;
        rabbitmq.VirtualHost = "/";
    });
});

//inject Handler
builder.Services.AddNebulaBusHandler(typeof(TestHandlerV1).Assembly);
```

## Detailed configuration

**The AddNebulaBus method is passed in Action\<NebulaOptions\>, so the configurable parameters of NebulaOptions are as follows:**

*   ClusterName: the name of the cluster, which defaults to the name of the assembly of the initiator, it is used to isolate the cluster storage, if the cluster name is the same, then NebulaBus will use the same storage, if the cluster name is different, then NebulaBus will use different storage, how to use memory storage then this parameter is invalid, because memory is not shared between independent processes, we do not recommend using memory storage in large distributed microservices, because memory storage cannot persist data, If the program crashes, the data will be lost.
*   ExecuteThreadCount: The default value is the number of processors, which indicates the number of threads executed, if set to 1, it means that 1 thread is used, and when the value is greater than 1, the order of data consumption cannot be guaranteed.
*   JsonSerializerOptions: Serializer configuration, using System.Text.Json

### transmit

**If you are using Rabbitmq as the transport, you need to configure RabbitmqOptions** 

The UseRabbitmq method is an Action\<RabbitmqOptions\>, so the configurable parameters for RabbitmqOptions are as follows

*   UserName: the rabbitmq username, which is guest by default
*   Password: rabbitmq password, which is set to guest by default
*   HostName: the rabbitmq hostname, which is localhost by default, if it is in cluster mode, you need to configure multiple HostNames separated by commas
*   VirtualHost: rabbitmq web hosting, default is /
*   Port: rabbitmq port, default is 5672
*   ExchangeName: the name of the rabbitmq switch, which is nebula-bus-exchange by default
*   SslOption: Rabbitmq SSL configuration, the default is null, how to use SSL, please refer to the Rabbitmq.NET Client documentation.
*   Qos: The default value of Rabbitmq QoS is 0, which means that there is no limit, how to use Qos, please refer to the Rabbitmq.NET Client documentation.
*   GetQos: This is the Func<string, string, ushort> type, which indicates the function to obtain Qos, the default value is null, the first parameter is the Name of the Handler, and the second parameter is the Handler Group

### storage

**If you use RedisStore as storage, you need to configure RedisStoreOptions**

The function of storage is to persist delayed data, including retry data, because the retry message is also a kind of delayed data in a sense according to the number of retries and the retry interval, if you do not use Redis storage, NebulaBus will use memory storage by default, so if the program crashes, the data will be lost. 
The UseRedisStore method passes in the Redis connection string in the format of "127.0.0.1:6379,password=\*\*\*\*\*\*,defaultDatabase=0".
Separate. Since NebulaBus uses FreeRedis as the Redis client, please refer to FreerRedis documentation for more parameters: [https://github.com/2881099/FreeRedis](https://github.com/2881099/FreeRedis)

### In the future, NebulaBus will support more transmission and storage, such as Kafka, Redis, etc., please pay attention to our updates.
