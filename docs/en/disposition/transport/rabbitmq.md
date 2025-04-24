# Rabbitmq Transport
This page will provide a detailed introduction to the RabbitMQ transmission of NebulaBus.

## Configuration
To configure NebulaBus to use RabbitMQ transport, please install the Nuget package NebulaBus Transport. RabbitMQ:

```shell
dotnet add package NebulaBus.Transport.Rabbitmq
```

Then use the following code to add rabbitmq transport:
```csharp
options.UseRabbitmqTransport(rabbitmq =>
{
    rabbitmq.HostName = "";
    rabbitmq.UserName = ""
    rabbitmq.Password = "";
    rabbitmq.VirtualHost = "";
});
```

The UseRabbitMqTransport method passes Action \<RabbitMqOptions \>, so RabbitMqOptions can be configured with the following parameters

- UserName: the rabbitmq username, which is guest by default
- Password: rabbitmq password, which is set to guest by default
- HostName: the rabbitmq hostname, which is localhost by default, if it is in cluster mode, you need to configure multiple HostNames separated by commas
- VirtualHost: rabbitmq web hosting, default is /
- Port: rabbitmq port, default is 5672
- ExchangeName: the name of the rabbitmq switch, which is nebula-bus-exchange by default
- SslOption: Rabbitmq SSL configuration, the default is null, how to use SSL, please refer to the Rabbitmq.NET Client documentation.
- Qos: The default value of Rabbitmq QoS is 0, which means that there is no limit, how to use Qos, please refer to the Rabbitmq.NET Client documentation.
- GetQos: This is the Func<string, string, ushort> type, which indicates the function to obtain Qos, the default value is null, the first parameter is the Name of the Handler, and the second parameter is the Handler Group
