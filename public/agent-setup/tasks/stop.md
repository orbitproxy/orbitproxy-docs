# 停止后台客户端

环境准备已经完成。不要再安装客户端，不要再执行 `npx skills add`。

只有用户明确要求停止由 `run --background` 启动的客户端时才执行：

```bash
<orbitproxy> stop
```

这个命令只停后台进程。系统服务和前台 `orbitproxy run` 不受影响。不要用它代替 `orbitproxy service stop`。
