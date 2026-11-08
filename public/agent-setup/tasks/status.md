# 查看本机状态

环境准备已经完成。不要再安装客户端，不要再执行 `npx skills add`。

执行：

```bash
<orbitproxy> status --json
```

把 `logged_in` 和客户端是否在运行告诉用户。这个命令不连接云网关，也不占用运行锁。
