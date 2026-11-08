# 删除一条策略

环境准备已经完成。不要再安装客户端，不要再执行 `npx skills add`。

只有用户明确要求删除某一条规则时才执行。先 `proxy policy list --json` 拿到 `type` 和 `rule_group_id`。

```bash
<orbitproxy> proxy policy delete --proxy-id <id> --type <type> --rule-group-id <rule_group_id> --json
```

成功时 `deleted` 为 true。规则已经不存在时是 `traffic_policy_rule_not_found`，告诉用户即可，不要再删别的规则。
