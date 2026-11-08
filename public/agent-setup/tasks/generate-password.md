# 生成 Basic 密码

环境准备已经完成。不要再安装客户端，不要再执行 `npx skills add`。

文件里必须已经有对应的 `basic_auth` 规则和用户名。命令只把密码写入这个用户，并把文件权限设成仅当前用户可读。

```bash
<orbitproxy> proxy policy generate-password --file <path> --name <规则名> --username <用户名>
```

标准输出只有文件路径、规则名和用户名。不要读取这个文件，不要把密码写进对话。写完如果用户要求提交，再按提交策略任务执行 `policy apply`。
