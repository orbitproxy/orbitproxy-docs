# 文档信息架构对照

对照对象：https://code.claude.com/docs/en/overview（2026-10-17 打开页面实测）。
本文只记录现有文件、现有导航、以及和 Claude 页面量出来的样式差。分组中文名没有定，下面凡是「待确认」都还没做决定。这次不改代码、不挪文件。

## Claude 实际是两层，不是侧栏里再套一层菜单

顶栏「Getting started」是按钮，带下拉。点开后菜单只有 6 条，每条一行说明，不是把侧栏里每一篇都塞进下拉：

| 下拉项 | 说明文案 |
| --- | --- |
| Overview | What Claude Code is and how to install it |
| Quickstart | Install, start a session, make your first change |
| Core concepts | How it works, what loads, what it costs |
| Use Claude Code | Memory, sessions, workflows, and prompts |
| Platforms and integrations | Terminal, IDEs, desktop, web, and Slack |
| Code review and pull requests | PR reviews, local review, security, and CI |

点进这个一级菜单之后，左侧才展开完整页面。分组标题是 `<h3>`，本身不是链接，也不能折叠。标题下面的页面是普通链接。只有少数条目是可折叠的按钮，例如「Claude Code in the cloud」「Code Review」。

同一套分组在两个地方出现：顶栏下拉是分组入口，左侧是分组标题加全部页面。What's New、Resources 没有下拉，是普通链接。

Getting started 左侧现在的分组和页面：

- Getting started：Overview、Quickstart、Changelog
- Core concepts：How Claude Code works、Extend Claude Code、Explore the .claude directory、Explore the context window、Prompt caching
- Use Claude Code：Store instructions and memories、Manage sessions、Common workflows、Prompt library、Best practices
- Platforms and integrations：Overview、Remote Control，以及可折叠的 Claude Code in the cloud、Claude Code on desktop，其余是 Mobile、Chrome、Computer use、VS Code、JetBrains、Slack、Claude Tag
- Code review and pull requests：可折叠的 Code Review、Security scans、Run Claude in your own CI，其余是 Review code locally、Ultrareview、GitHub Enterprise Server

正文标题上方有一行大写眉题 `GETTING STARTED`，文案是当前一级菜单的名字，不是当前分组的名字。

## 我们现在的导航不跟文件夹走

磁盘目录在 `content/docs/*/meta.json`。页面上看到的一级菜单和左侧列表写在 `components/docs-shell.tsx` 的 `PRIMARY_NAV`。两套不是同一份数据。

`lib/layout.shared.tsx` 里还有一份链接（概览、API Gateway、MCP Gateway、客户端），仓库里没有引用它。线上用的是 `PRIMARY_NAV`。

现在的一级菜单是 5 个普通链接，没有下拉：

| 一级 | 点进去的地址 | 左侧 |
| --- | --- | --- |
| 概览 | `/docs` | 没有侧栏。`/docs/start/how-it-works` 也算在这个菜单下，侧栏同样是空的 |
| API Gateway | `/docs/gateway/overview` | 两个纯文字分组：入门指引、使用用例 |
| MCP Gateway | `/docs/mcp-gateway/overview` | 三个纯文字分组：入门指引、用例、概念 |
| 流量策略 | `/docs/gateway/traffic-policy` | 没有分组标题，9 篇平铺 |
| 客户端 | `/docs/client/cli` | 只有 1 篇，没有分组标题 |

左侧分组是 `separator`，渲染成 `.docs-nav-label`。`NavFolder` 可以折叠，但 `PRIMARY_NAV` 没有产出任何 folder，所以折叠样式现在用不上。

换一篇文章出现在哪个分组，只改 `PRIMARY_NAV`，URL 不变。移动 `mdx` 文件会改 URL。下面把这两种分开列。

## 现有正文

共 31 个 `mdx`。下面「侧栏」一列是现在页面上能不能从左侧点到。

### 概览

| 文件 | title | 侧栏 | 正文里实际有的东西 |
| --- | --- | --- | --- |
| `content/docs/index.mdx` | 概览 | 无（这一页就是一级入口） | 产品介绍、B 站视频、四张卡片（流量入口、API Gateway、MCP 网关、访问日志）、六张「你或许还想了解」、两张集成卡片 |
| `content/docs/start/how-it-works.mdx` | orbitproxy 网关如何工作？ | 无 | 只有 frontmatter，正文是空的 |

### API Gateway

`content/docs/gateway/meta.json` 的顺序：overview、quickstart、webhook、endpoints、traffic-policy、observability、use-cases。侧栏没有按这个顺序走。

| 文件 | title | 现在出现在 | 正文 |
| --- | --- | --- | --- |
| `gateway/overview.mdx` | 概览 | API Gateway / 入门指引 | 网关能做什么，卡片链到快速开始、流量策略、云端点、可观测性 |
| `gateway/quickstart.mdx` | 快速开始 | API Gateway / 入门指引 | 一句说明加 B 站视频 |
| `gateway/endpoints.mdx` | 云端点 | API Gateway / 入门指引 | 云端点字段、创建、管理 |
| `gateway/webhook.mdx` | Webhook 网关 | 不在任何侧栏 | localhost 接支付回调、生产验签、工作原理 |
| `gateway/observability.mdx` | 可观测性 | 不在任何侧栏。概览卡片和 API 概览卡片链到这里 | 采集级别、指纹、访问趋势 |
| `gateway/traffic-policy.mdx` | 概览 | 流量策略一级菜单的第一项，不在 API Gateway 侧栏 | 请求生命周期、策略列表、使用场景 |
| `gateway/use-cases/traffic-entry.mdx` | 使用orbitproxy作为你任何服务的流量入口 | API Gateway / 使用用例 | 有步骤的发布案例 |
| `gateway/use-cases/wechat-webhook.mdx` | localhost/内网服务接收微信支付等第三方 webhook回调 | API Gateway / 使用用例 | 为什么在网关收 webhook。后面没有步骤正文 |
| `gateway/use-cases/maintenance-mode.mdx` | 快速让生产环境服务进入维护熔断模式 | API Gateway / 使用用例 | 有步骤 |
| `gateway/use-cases/block-bots.mdx` | 为你的服务阻止不必要的钓鱼请求或爬虫流量 | API Gateway / 使用用例 | 只有 `<DocsPlaceholder />` |
| `gateway/use-cases/compress-json.mdx` | 压缩你的JSON响应以获取更高性能和减少带宽流量消耗 | API Gateway / 使用用例 | 只有 `<DocsPlaceholder />` |

### MCP Gateway

| 文件 | title | 现在出现在 | 正文 |
| --- | --- | --- | --- |
| `mcp-gateway/overview.mdx` | 概述 | 入门指引 | 卡片链到快速开始、Connector、Composer、可观测性 |
| `mcp-gateway/quickstart.mdx` | 快速开始 | 入门指引 | 一句说明加 B 站视频 |
| `mcp-gateway/connector.mdx` | MCP Connector | 入门指引 | 内部 Connector、公开 Connector |
| `mcp-gateway/composer.mdx` | MCP Composer | 入门指引 | 工作方式、创建、成员、和公开 Connector 的区别 |
| `mcp-gateway/use-cases/connect-internal.mdx` | 连接你的内部Stdio MCP服务 | 用例 | 有步骤 |
| `mcp-gateway/use-cases/composer.mdx` | 使用MCP Composer聚合多个MCP服务 | 用例 | 只有 `<DocsPlaceholder />` |
| `mcp-gateway/observability.mdx` | MCP可观测性 | 概念。侧栏显示名被改成「MCP可观测性」，和 title 相同 | 记录内容、查看日志、使用统计、排查、高危请求 |

### 流量策略

磁盘在 `content/docs/policy/`。侧栏挂在「流量策略」一级下面，第一项却是 `gateway/traffic-policy.mdx`。

| 文件 | title | 现在出现在 | 正文 |
| --- | --- | --- | --- |
| `policy/index.mdx` | 流量策略 | 不在侧栏。概览页链到 `/docs/policy` | 能力表。和 `traffic-policy.mdx` 的表有重叠 |
| `policy/ip-access.mdx` | IP访问控制或基本身份验证 | API Gateway / 使用用例，不在流量策略 | 带步骤的案例，不是配置参考 |
| `policy/ip-access-control.mdx` | IP访问控制 | 流量策略，平铺 | 配置参考、行为、示例 |
| `policy/basic-auth.mdx` | BasicAuth 基础鉴权 | 流量策略，平铺 | 配置参考、行为、控制台、示例 |
| `policy/api-key.mdx` | API 访问密钥 | 流量策略，平铺 | 配置参考、行为、示例 |
| `policy/http-header.mdx` | 添加/移除HTTP Header | 流量策略，平铺 | 配置参考、行为、示例 |
| `policy/custom-response.mdx` | 自定义异常页面 | 流量策略，平铺 | 带步骤的案例，结构和其他策略篇不一样 |
| `policy/access-log.mdx` | 访问日志 | 流量策略，平铺 | 配置参考、行为、示例 |
| `policy/webhook-verify.mdx` | Webhook 验证 | 流量策略，平铺 | 配置参考、身份源、控制台 |
| `policy/mcp-access.mdx` | MCP 访问控制 | 流量策略，平铺 | 配置参考、行为、控制台、示例 |

`policy/index.mdx` 的表里还有三行没有对应文档：请求重写（写着可用）、JWT 鉴权（即将推出）、OAuth 2.1（即将推出）。

### 客户端

| 文件 | title | 侧栏 | 正文 |
| --- | --- | --- | --- |
| `client/cli.mdx` | 客户端命令行界面（Cli） | 客户端，仅此一篇 | `authtoken`、`run`、`status`、`service`、`reset`、`delete` |

## 侧栏和文件对不上的地方

这些是现在就已经对不上的，不是新方案。

不在任何侧栏、文件还在：

- `content/docs/start/how-it-works.mdx`
- `content/docs/gateway/webhook.mdx`
- `content/docs/gateway/observability.mdx`
- `content/docs/policy/index.mdx`

在侧栏里，但和所在文件夹的一级菜单不是同一个：

- `content/docs/policy/ip-access.mdx` 在 API Gateway 的「使用用例」。同目录的 `ip-access-control.mdx` 在流量策略。
- `content/docs/gateway/traffic-policy.mdx` 在流量策略一级。同目录的 overview、quickstart、endpoints 在 API Gateway。

空正文或占位，侧栏里已经有入口：

- `start/how-it-works.mdx`（空）
- `gateway/use-cases/block-bots.mdx`
- `gateway/use-cases/compress-json.mdx`
- `mcp-gateway/use-cases/composer.mdx`

要不要把这些文件挪到别的目录：还没定。挪文件会改 URL。只改 `PRIMARY_NAV` 就能改侧栏归属。

## 正文里指向不存在文件的链接

这些路径在 `content/docs` 下没有 `mdx`：

| 链接 | 出现在 | 现有最接近的一篇 |
| --- | --- | --- |
| `/docs/cases/api/wechat-webhook` | `index.mdx`、`gateway/webhook.mdx` | `gateway/use-cases/wechat-webhook.mdx` |
| `/docs/cases/api/intranet-erp-cms` | `index.mdx` | 没有 |
| `/docs/cases/mcp/agent-ops` | `index.mdx` | `mcp-gateway/use-cases/connect-internal.mdx` |
| `/docs/cases/webhook/access-log-replay` | `index.mdx`、`gateway/traffic-policy.mdx` | 没有。`gateway/observability.mdx` 写了重放，但不是这篇 |
| `/docs/cases/api/localhost-api` | `index.mdx` | `gateway/use-cases/traffic-entry.mdx` 讲的是发布入口，标题不是这篇 |
| `/docs/integrate/sdk` | `index.mdx` | 没有 |
| `/docs/observe/access-logs` | `gateway/traffic-policy.mdx` | `gateway/observability.mdx`、`policy/access-log.mdx` 都在，路径不是这个 |
| `/docs/cases/access-logs` | `gateway/traffic-policy.mdx`、`gateway/observability.mdx` | 没有 |
| `/docs/cases/webhook/cloud-verify` | `gateway/webhook.mdx` | `policy/webhook-verify.mdx` 是配置参考，路径不是这个 |

「最接近」只说明主题靠近，没有把链接改过去。

## 要做成 Claude 那种一级菜单，代码上要动的位置

机制差在这里。分组叫什么还没定，所以这里不列新目录树。

1. `components/docs-shell.tsx` 的一级项现在是 `<Link>`。Claude 带分组的一级项是 `<button aria-haspopup="menu">`，菜单项是分组入口，带一行说明。What's New 那种没有子分组的仍是链接。我们 5 个一级里，流量策略和客户端现在没有分组标题。
2. 下拉菜单组件现在没有。左侧 `.docs-nav-label` 已经是分组标题，但顶栏不会弹出同一份分组。
3. 下拉里点「Core concepts」会进入该分组的第一篇。我们如果做同样的事，每个分组要有一个落地页。现在「使用用例」「概念」没有自己的落地页，只有下面的文章。
4. `app/docs/[[...slug]]/page.tsx` 的标题行只有 `h1` 和 Copy page。Claude 在 `h1` 上面有眉题，文案是一级菜单名。
5. `components/copy-page.tsx` 是一颗按钮。Claude 是「Copy page」加一个「More actions」下拉，左侧圆角、右侧分开。
6. 右侧目录没有「On this page」标题。Claude 有，并且标题行可以收起目录。
7. 文章底部 Claude 有「Was this page helpful?」和「Next: Quickstart」。我们没有。

## 样式差

只列 2026-10-17 在 `code.claude.com/docs/en/overview` 上量到的值，以及 `app/global.css` 里对应的规则。已经一致的不改。

侧栏链接已经对齐，不用改：未选中约 14px / 24px，选中高度 36px，圆角 12px，padding `6px 12px 6px 16px`，选中底是约 10% 黑。

| 位置 | Claude 量到的 | 我们现在 | 要改的选择器 |
| --- | --- | --- | --- |
| 一级菜单字重和颜色 | 按钮，14px，字重 600，颜色 `rgb(37, 37, 37)`，高度 48px。当前项是底边深色线 | `.docs-header-nav a` 字重 400，当前项字重 500、颜色 `#ed0911`，底边用 `::after` 做 1.5px | `.docs-header-nav a`、`.docs-header-nav a[data-active="true"]` |
| 一级是下拉时的菜单 | 白底浮层，左图标，标题加一行灰色说明 | 没有这个浮层 | 新样式，现有 CSS 里没有 |
| 左侧分组标题 | 14px / 24px，字重 600，颜色 `rgb(23, 23, 23)`，左 padding 16px，下 margin 10px | `.docs-nav-label` 字重 500，颜色 `#171717`，其余接近 | `.docs-nav-label` 的 `font-weight` |
| 分组之间的空隙 | 相邻 `.sidebar-group` 外框间距 66px | 下一个 `.docs-nav-label` 的 `margin-top: 2rem`（32px） | `.docs-nav-label + …` 那三条 |
| 选中链接字重 | 400 | `.docs-nav-link[data-selected="true"]` 是 500 | 这一条 |
| 可折叠子项 | 和普通链接同一套 padding，颜色 `rgb(62, 62, 62)`，右侧 chevron | `.docs-nav-folder` 已有 chevron，但导航数据没用到 folder | 先不改 CSS。等真的有折叠项再对 |
| 眉题 | `.eyebrow`，大写，14px，字重 600，字距 0.32px，行高 20px，下 margin 10px，颜色 `rgb(14, 14, 14)` | 没有眉题 | `page.tsx` 要先输出元素，再加样式 |
| `h1` | 36px / 40px，字重 400，颜色 `rgb(23, 23, 23)`，字距 normal | `.docs-title` 字重 600，字距 -0.9px，颜色 `rgb(23, 24, 28)`。注释写的是 ngrok 的测量 | `.docs-title` |
| 标题下的导语 | 包在 `mt-2 text-lg` 里。量到内部 `p` 是 16px / 26.4px，颜色 `rgb(62, 62, 62)` | `.docs-desc` 是 18px / 28px，颜色 `rgb(63, 64, 68)`。注释写的是 ngrok | `.docs-desc` |
| Copy page | 高 34px，16px，字重 400，颜色 `rgb(62, 62, 62)`，背景 `rgb(253, 253, 247)`，圆角 `12px 0 0 12px`，和右侧更多按钮拼在一起 | `.docs-btn.docs-btn-secondary`，高 32px，14px，四边圆角 8px | `.docs-btn`、`.docs-btn-secondary`，以及按钮要拆成两截 |
| 右侧目录标题 | 「On this page」，14px / 24px，字重 400，颜色 `rgb(80, 80, 80)` | `.docs-toc` 没有标题 | `.docs-toc` 前加标题 |

正文里的代码块、卡片、表格这次没和 Claude 对过，不写进要改的列表。

## 待确认

分组名和一篇文章归哪一组，等你定。定之前不动文件。

1. 五个一级菜单留着，只给每个加上 Claude 那种下拉；还是把一级收成更少的几项，再在下面分「概念 / 怎么用」这种组。
2. 不在侧栏的四篇（how-it-works、webhook、可观测性、policy/index）各自进哪个一级、哪个分组。
3. `policy/ip-access.mdx` 留在 API Gateway 用例，还是改到流量策略。
4. `policy/index.mdx` 和 `gateway/traffic-policy.mdx` 两篇都在讲策略列表，留两篇还是合成一篇。
5. 下拉项的一行说明，每组用哪句。
6. 上面样式表是不是这一轮都改。眉题、Copy page 拆按钮、目录标题会改 DOM，不只是 CSS。
