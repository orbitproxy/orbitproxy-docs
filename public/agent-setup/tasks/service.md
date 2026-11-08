# 注册为系统服务

环境准备已经完成。不要再安装客户端，不要再执行 `npx skills add`。

只有用户明确要求开机自启或注册系统服务时才执行。配置仍在 `~/.orbitproxy`。安装、启动、停止、重启、卸载需要管理员权限。当前系统不支持时命令会失败，把失败告诉用户，不要改用别的安装方式。

```bash
<orbitproxy> service install
<orbitproxy> service start
<orbitproxy> service stop
<orbitproxy> service restart
<orbitproxy> service status
<orbitproxy> service uninstall
```

`service stop` 停的是系统服务，不是 `orbitproxy stop` 停的后台进程。本机已经有客户端在跑时，安装可能失败，先告诉用户。
