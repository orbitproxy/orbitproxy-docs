# 列出这台电脑上的云端点

环境准备已经完成。不要再安装客户端，不要再执行 `npx skills add`。

执行：

```bash
<orbitproxy> list --json
```

把每个云端点的 `proxy_id`、`public_url`、`protocol`、本地地址告诉用户。没有云端点时直接说没有，不要新建。
