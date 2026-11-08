# 列出策略

环境准备已经完成。不要再安装客户端，不要再执行 `npx skills add`。

```bash
<orbitproxy> list --json
<orbitproxy> proxy policy list --proxy-id <id> --json
```

没有云端点就停下。有多个时问用户要看哪一个。用户已经指定了服务或端口，就按那个匹配。

输出里没有 Basic 密码。API key 只有前缀。不要补全秘密。
