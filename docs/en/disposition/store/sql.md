# Sql Store
This page will provide a detailed introduction to the SQL storage of Nebula Bus.

## Configuration
To configure Nebula Bus to use SQL storage, install the Nuget package NebulaBus.Store.SQL:

```shell
dotnet add package NebulaBus.Store.Sql
```

Then use the following code to add SQL storage:
```csharp
options.UseSqlStore(new SqlSugar.ConnectionConfig()
{
    ConnectionString = "your sql connection string",
    DbType=SqlSugar.DbType.MySql
});
```
The UseSqlStore method passes in the SQL Sugar.ConnectConfig object, and NebulaBus SQL stores using SQL Sugar as the SQL client. Therefore, it supports multiple databases such as MySql, SQL Server, SQLite, Oracle, PostgreSQL, Dameng, DB2, Duckdb, etc. For more information, please refer to the SQLSugar documentation: https://www.donet5.com/Home/Doc?typeId=1180