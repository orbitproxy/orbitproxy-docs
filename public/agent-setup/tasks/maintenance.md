# 开启维护模式

环境准备已经完成。不要再安装客户端，不要再执行 `npx skills add`。不要发布临时页面。

1. `<orbitproxy> list --json`。没有云端点时告诉用户还没有可维护的云端点，然后停下。
2. 只有一个 HTTPS 云端点时用它的 `proxy_id`。有多个时问用户要维护哪一个。用户已经指定了服务或端口，就按那个匹配。
3. 对 HTTPS 云端点执行：

```bash
<orbitproxy> proxy maintenance --proxy-id <id> --enable
```

TCP 云端点会返回 `maintenance_not_supported`。把这个结果告诉用户，不要安装别的东西，也不要改成别的命令。

成功后告诉用户维护已打开，访客会看到维护页。用户要求关闭时再执行 `--disable`。
