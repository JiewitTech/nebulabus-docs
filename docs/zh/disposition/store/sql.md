# Sql存储
这个页面将详细介绍NebulaBus的Sql存储。

## 配置
要配置NebulaBus使用Sql存储，请安装Nuget包 NebulaBus.Store.Sql:

```shell
dotnet add package NebulaBus.Store.Sql
```

然后使用如下代码添加Sql存储：
```csharp
options.UseSqlStore(new SqlSugar.ConnectionConfig()
{
    ConnectionString = "your sql connection string",
    DbType=SqlSugar.DbType.MySql
});
```
UseSqlStore 方法传入的是SqlSugar.ConnectionConfig 对象，NebulaBus Sql 存储使用SqlSugar作为Sql客户端，因此支持MySql、SqlServer、Sqlite、Oracle 、 postgresql、达梦、DB2、Duckdb等多种数据库，更多信息请自行参考SqlSugar文档：
> https://www.donet5.com/Home/Doc?typeId=1180

具体代码示例可参考：
> https://github.com/JiewitTech/NebulaBus/tree/main/src/Samples/RabbitmqWithSqlStoreWebApiSample