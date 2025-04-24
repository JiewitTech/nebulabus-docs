# Redis Store
This page will provide a detailed introduction to Nebula Bus's Redis storage.

## Configuration
To configure Nebula Bus to use Redis storage, please install the Nuget package NebulaBus.Store.Redis:

```shell
dotnet add package NebulaBus.Store.Redis
```

Then use the following code to add Redis storage:
```csharp
options.UseRedisStore("");
```
The UseRedisStore method passes in a Redis connection string
The string format is: "127.0.0.1:6379, password=******, defaultDatabase=0". If it is in cluster mode, multiple Redis connection strings need to be configured with semicolons; separate.
Due to NebulaBus using FreeRedis as its Redis client, please refer to the FreerRedis documentation for more parameters: https://github.com/2881099/FreeRedis