# 用 authtoken 注册

环境准备已经完成。不要再安装客户端，不要再执行 `npx skills add`。

不要向用户索要 authtoken，也不要在命令、日志或文件里打印它。用户要自己在自己的终端执行：

```bash
<orbitproxy> authtoken <token>
```

可选 `--name` 显示名，`--machine-key` 恢复已有机器，`--force` 覆盖本机已有配置。agent 不要代填 token。交互环境优先用 `orbitproxy login`。
