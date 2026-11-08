# 启动客户端

环境准备已经完成。不要再安装客户端，不要再执行 `npx skills add`。

先执行 `<orbitproxy> status --json`。已经在运行就不要再启动。

没有在运行时：

```bash
<orbitproxy> run --background
```

它会等到连上云网关再返回，最多 15 秒。已经在运行时，命令会等待它在线。退出码 `6` 表示没有连上云网关。macOS 上不要用 `sudo` 执行 `run`。

这个命令只启动后台客户端。不要改用 `orbitproxy service`，除非用户明确要求注册系统服务。
