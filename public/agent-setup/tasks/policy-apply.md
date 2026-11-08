# 提交策略

环境准备已经完成。不要再安装客户端，不要再执行 `npx skills add`。不要发布临时页面。

1. `<orbitproxy> list --json` 找到云端点。没有云端点就停下，不要为了加策略新建一个，除非用户这条消息同时要求发布。
2. 策略文件是 JSON，顶层是 `rules` 数组。每条必须有布尔 `enabled`。文件里不能有 `proxyId`。
3. HTTPS 云端点可以提交的类型只有：`ip_access_control`、`basic_auth`、`api_key_auth`、`http_header`、`host_rewrite`、`custom_response`、`webhook_verify`。TCP 云端点只能提交 `ip_access_control`，其它类型不要发给控制面。
4. 执行：

```bash
<orbitproxy> proxy policy apply --proxy-id <id> --file <path> --json
```

成功时看 `applied` 里每条是 `created` 还是 `updated`。`custom_response` 看 `reviewStatus`。`pending` 时告诉用户页面还在审核，访客仍看到原来的响应。做到一半失败时，`applied` 是已经写上的，`failed` 是失败的那条。不要重试已经成功的规则。

Basic 密码和 API key 不要打印到对话里。创建或轮换时用 `generate-password`、`generate-key` 写进文件。更新时可以不写已有的密码或 key。
