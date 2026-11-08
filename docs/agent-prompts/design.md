# 分页面提示词

> 变更分级：M。只改文档里的 agent 提示词和各页面的复制文案。不改控制面接口，不改客户端命令。
> 状态：已审批（2026-10-23）。提示词已按本文拆开。

## 业务目标

每个功能页有自己的一句提示词。用户把它贴给 agent 之后，agent 先确认这台电脑已经有客户端、技能和登录，缺什么就只补什么，齐了就只做这一页的事。

## 现在的问题

官方提示词在 `orbitproxy-docs/public/agent-setup/prompt.md`。控制台安装页和文档快速入门复制的都是「阅读这个文件，把服务发布到公网」。

客户端这一段已经写了：先看程序在不在，在就用现有的，不重复安装。

技能这一段没有检查。客户端步骤结束后固定执行 `npx skills add orbitproxy/skills -g --all`。已经装过也会再拉仓库、再写一遍技能文件。

这份文件的任务也只有「发布到公网」。访问日志、维护模式这些页面没有自己的提示词。

## 两段结构

公共准备和本页任务分开。

**公共准备**放在 `agent-setup/prepare.md`。每条页面提示词都先让 agent 读它。它只做三件事：

1. 客户端。看 `~/.orbitproxy/bin/orbitproxy`（Windows 是 `$env:LOCALAPPDATA\orbitproxy\orbitproxy.exe`，若用户机器上已有 `~\.orbitproxy\bin\orbitproxy.exe` 就用那个）。存在就用它，不跑安装脚本。不存在才安装。
2. 技能。执行 `npx skills ls -g --json`。结果里已经有 `orbitproxy-setup` 就视为技能包已安装，不执行 `npx skills add`。没有这条，或本机没有 `npx`，才安装。没有 `npx` 时告诉用户技能没装上，不要换一种安装方式。
3. 登录。`<orbitproxy> status --json` 里 `logged_in` 为 true 就跳过。否则按现在的 `login` 流程，等用户在浏览器里确认。

准备段不做业务。不发布临时页面，不加策略，不查日志。

**本页任务**放在 `agent-setup/tasks/<能力>.md`。准备完成后只做这个文件里的事。

页面上复制给用户的句子里，准备地址和本页任务都要写上。任务的那句话留在复制内容里，避免 agent 只打开准备文件就停。

```
先阅读 https://docs.orbitproxy.cc/agent-setup/prepare.md 并按其执行。
环境已经就绪后，不要重复安装。然后为当前这个服务开启维护模式，做法见 https://docs.orbitproxy.cc/agent-setup/tasks/maintenance.md
```

安装页和快速入门仍是发布第一个公网地址。它也先走 `prepare.md`，任务文件是现在的发布步骤，不再把安装脚本无条件放在任务前面。

## 缺什么就补什么

准备段按上面的顺序检查。某一项已经满足就跳过，不从头再来。

| 客户端 | 技能 | 登录 | agent 做什么 |
| --- | --- | --- | --- |
| 没有 | 没有 | 没有 | 安装客户端，安装技能，登录，然后做本页任务 |
| 已有 | 没有 | 已登录 | 只安装技能，然后做本页任务 |
| 已有 | 已有 | 已登录 | 什么都不装，直接做本页任务 |
| 没有 | 已有 | 已登录 | 只安装客户端，然后做本页任务 |
| 已有 | 已有 | 没有 | 只登录，然后做本页任务 |

用户在执行某一页的提示词时发现没有客户端或技能，就走这个准备段，补完再回到本页任务。不改去执行「发布一个临时页面」。

## 例子

### 访问日志页

复制的句子：

```
先阅读 https://docs.orbitproxy.cc/agent-setup/prepare.md 并按其执行。
环境已经就绪后，不要重复安装。然后查看我这台客户端上云端点最近的访问日志，做法见 https://docs.orbitproxy.cc/agent-setup/tasks/access-logs.md
```

任务文件只写现在 CLI 做得到的事：`orbitproxy list --json` 找到这个云端点的 `proxy_id`，再 `orbitproxy proxy logs --proxy-id <id> --json`。一次最多 80 条摘要。没有「打开采集级别」的命令。任务文件要写明：CLI 不能开关访问日志采集，只能读已经记下的摘要。套餐没有权益是 403，存储未配置是 503，这时停下并说明，不要改去装客户端。

### 维护模式页

任务是对用户指定的 HTTPS 云端点执行 `orbitproxy proxy maintenance --proxy-id <id> --enable`。TCP 云端点命令会返回 `maintenance_not_supported`，把这个结果告诉用户，不要装别的东西。

### 第一次使用，从访问日志页进来

用户没有客户端，也没有技能。agent 按准备段安装客户端、安装技能、登录。登录完成后不再问「要不要发布临时页面」，回到访问日志任务。没有云端点时告诉用户还没有可查的云端点，不要自己创建一个来凑日志。

### 客户端已装、技能已装，再点维护模式

`orbitproxy` 程序已在，`npx skills ls -g --json` 里已有 `orbitproxy-setup`，`status --json` 已登录。agent 不跑安装脚本，不跑 `skills add`，只执行维护模式任务。

### 只有技能，客户端被删了

技能列表里还有 `orbitproxy-setup`，程序路径不存在。只重装客户端，不重新 `skills add`。装完看登录状态，再做本页任务。

## 不做什么

不在每个功能提示词里执行 `npx skills update`。更新技能包另走更新，不绑在页面按钮上。

CLI 做不到的步骤不写进任务文件，也不编命令。`run-mcp-gateway` 和 `provision-sandbox-access` 仍然只说明做不到并停下。
