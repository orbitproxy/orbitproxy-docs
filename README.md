# orbitproxy 文档

[orbitproxy](https://orbitproxy.cc) 的官方产品文档源码，线上地址：**[docs.orbitproxy.cc](https://docs.orbitproxy.cc)**。

orbitproxy 可以把 localhost 和内网服务发布到公网，提供 API 网关、MCP 网关、流量策略与全链路访问日志，让 AI Agent 安全地连接内网 MCP 服务。

## 文档内容

| 模块 | 说明 | 入口 |
|---|---|---|
| 开始使用 | orbitproxy 的工作方式与核心概念 | [网关如何工作](https://docs.orbitproxy.cc/docs/start/how-it-works) |
| API Gateway | 云端点、流量入口、Webhook、访问日志与典型用例 | [概览](https://docs.orbitproxy.cc/docs/gateway/overview) · [快速开始](https://docs.orbitproxy.cc/docs/gateway/quickstart) · [云端点](https://docs.orbitproxy.cc/docs/gateway/endpoints) |
| MCP Gateway | 通过 MCP Connector 与 Composer 安全暴露、聚合内网 MCP 服务 | [概览](https://docs.orbitproxy.cc/docs/mcp-gateway/overview) · [快速开始](https://docs.orbitproxy.cc/docs/mcp-gateway/quickstart) · [Connector](https://docs.orbitproxy.cc/docs/mcp-gateway/connector) · [Composer](https://docs.orbitproxy.cc/docs/mcp-gateway/composer) |
| 流量策略 | API Key、Basic Auth、IP 访问控制、HTTP 头、自定义响应、MCP 访问控制、Webhook 校验、访问日志 | [流量策略](https://docs.orbitproxy.cc/docs/policy) |
| 客户端 | orbitproxy CLI 的安装与使用 | [CLI](https://docs.orbitproxy.cc/docs/client/cli) |

## 常见场景

- [使用 orbitproxy 作为任何服务的流量入口](https://docs.orbitproxy.cc/docs/gateway/use-cases/traffic-entry)
- [快速让生产环境服务进入维护熔断模式](https://docs.orbitproxy.cc/docs/gateway/use-cases/maintenance-mode)
- [localhost/内网服务接收微信支付等第三方 Webhook 回调](https://docs.orbitproxy.cc/docs/gateway/use-cases/wechat-webhook)
- [连接你的内部 Stdio MCP 服务](https://docs.orbitproxy.cc/docs/mcp-gateway/use-cases/connect-internal)

## 本地开发

技术栈：Next.js 16、[Fumadocs](https://fumadocs.dev)、MDX、Tailwind CSS 4。

```bash
npm install
npm run dev
```

打开 <http://localhost:3333>。

文档正文位于 `content/docs/`，侧边栏分组在 `components/docs-shell.tsx` 中维护，SEO 相关配置（站点地址、标题、描述、sitemap）位于 `lib/seo.ts`。

官网（`orbitproxy-website`）通过环境变量 `NEXT_PUBLIC_DOCS_URL` 链接到本站，本地默认值为 `http://localhost:3333`，线上为 `https://docs.orbitproxy.cc`。

## 反馈

发现文档错误或有改进建议，欢迎提交 [Issue](https://github.com/orbitproxy/orbitproxy-docs/issues)。

## 许可

Copyright (c) 2026 数轨引力（深圳）科技有限公司。保留所有权利，详见 [LICENSE](./LICENSE)。
