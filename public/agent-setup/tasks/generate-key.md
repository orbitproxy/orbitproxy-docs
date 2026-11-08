# 生成 API key

环境准备已经完成。不要再安装客户端，不要再执行 `npx skills add`。

文件里必须已经有对应的 `api_key_auth` 规则和 `client`。命令只写入这个 client 的 `key`。

```bash
<orbitproxy> proxy policy generate-key --file <path> --name <规则名> --client <client 名>
```

标准输出只有文件路径、规则名和 client 名。不要读取这个文件，不要把 key 写进对话。写完如果用户要求提交，再按提交策略任务执行 `policy apply`。
