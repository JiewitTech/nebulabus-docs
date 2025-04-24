# Performance

This page will detail NebulaBus high-performance best practices.

## Multi-consumption thread mode

NebulaBus supports multi-threaded consumption, which is the number of processors by default, and you can also set the number of threads consumed by setting different ExecuteThreadCount values for different handlers. For high-traffic, high-concurrency scenarios, you can consume the number of threads for it.

## Multi-process scale-out

NebulaBus supports distribution, if multi-threading is not enough for your needs, you can separate the high-concurrency Handler into independent processes and deploy them to different machines or K8s, so that your application will have better scalability, and you can add new machines or K8s to expand your application at any time.

## Distributed best practices

To support distribution, you must configure Redis storage, configure different ClusterName for different cluster services, which will isolate delayed messages between cluster services, and each node will compete to obtain Redis locks to ensure the unique scheduling of messages. At the same time, if a node goes down, other nodes in the cluster will automatically replace it to ensure the reliability of the message.

