import { readFileSync, statSync } from "node:fs"
import path from "node:path"

export const SITE_URL = "https://docs.orbitproxy.cc"
export const SITE_NAME = "orbitproxy docs"
export const SITE_LOCALE = "zh_CN"
export const SITE_TITLE = "orbitproxy 文档 - API 网关、MCP 网关与流量策略"
export const SITE_DESCRIPTION =
  "orbitproxy 产品文档：把 localhost 和内网服务发布到公网，提供 API 网关、MCP 网关、流量策略与全链路访问日志，让 AI Agent 安全连接内网 MCP 服务。"
export const SITE_OG_IMAGE = "/logo-mark-200.png"

/**
 * 只给搜索引擎看的页面摘要（<meta name="description"> / OG / JSON-LD）。
 * 页面 frontmatter 里已有 description 的以 frontmatter 为准；
 * 这里补的是没有 description 的页面，避免页面正文顶部多出一行重复的简介。
 */
const SEO_DESCRIPTIONS: Record<string, string> = {
  "/docs/client/cli":
    "orbitproxy 命令行客户端参考：authtoken 注册机器、run 运行、status 查看状态、service 服务管理，以及 reset 与 delete 的用法和参数。",
  "/docs/gateway/overview":
    "orbitproxy API 网关：把 localhost、内网和云主机上的 HTTP/TCP 服务发布到公网，并提供访问控制、认证鉴权、限速与全链路访问日志。",
  "/docs/gateway/quickstart":
    "3 分钟把 localhost 服务发布到公网：创建 orbitproxy 云端点并获得 HTTPS 访问地址的视频演示。",
  "/docs/gateway/endpoints":
    "了解 orbitproxy 云端点：持久在线的 HTTP/TCP 网关流量入口，涵盖基本概念、创建方式与日常管理，把公网请求安全转发到内网或本地服务。",
  "/docs/gateway/use-cases/traffic-entry":
    "使用 orbitproxy 云端点把 localhost 或内网服务发布为 API 网关，并通过访问日志观测每一个进入服务的请求。",
  "/docs/gateway/use-cases/wechat-webhook":
    "让 localhost 和内网服务接收微信支付等第三方 Webhook 回调，并在 orbitproxy 网关层验证回调签名，只放行合法请求。",
  "/docs/gateway/use-cases/maintenance-mode":
    "不改代码、不停服务，在 orbitproxy 云网关一键让生产环境进入维护熔断模式，向访问者展示维护页面，并在访问日志中追踪被熔断的请求。",
  "/docs/policy/custom-response":
    "为 502、503、590 等网关异常状态配置品牌化的自定义响应页面，避免服务异常时用户看到空白页面或浏览器错误。",
  "/docs/policy/ip-access":
    "为云端点同时配置 IP 访问控制和基本身份验证：只有受信任来源 IP 或持有有效凭据的请求才能访问，无需修改服务代码。",
  "/docs/mcp-gateway/overview":
    "orbitproxy MCP 网关：连接任何位置、任何形态的 MCP 服务，为 AI Agent 提供统一认证鉴权、访问控制、高危操作拦截与全链路调用追踪。",
  "/docs/mcp-gateway/quickstart":
    "3 分钟让 Cursor 通过 orbitproxy MCP Gateway 连接内网 MySQL MCP 服务的视频演示。",
  "/docs/mcp-gateway/connector":
    "MCP Connector 把各个环境的 MCP 服务注册到 orbitproxy MCP Gateway：内部 Connector 仅供 Composer 聚合，公开 Connector 拥有 HTTPS 公网地址。",
  "/docs/mcp-gateway/use-cases/connect-internal":
    "在 orbitproxy MCP Gateway 上注册内网 Stdio MCP 服务，让 Cursor、Trae 等 AI Agent 无需暴露数据库和密钥即可安全访问。",
}

export function seoDescriptionOf(url: string, frontmatterDescription?: string): string | undefined {
  return frontmatterDescription ?? SEO_DESCRIPTIONS[url]
}

const CONTENT_DIR = path.join(process.cwd(), "content", "docs")

type Section = { label: string; href: string }

const SECTIONS: Record<string, Section> = {
  gateway: { label: "API Gateway", href: "/docs/gateway/overview" },
  "mcp-gateway": { label: "MCP Gateway", href: "/docs/mcp-gateway/overview" },
  policy: { label: "流量策略", href: "/docs/gateway/traffic-policy" },
  client: { label: "客户端", href: "/docs/client/cli" },
}

/** 这篇是 API Gateway 的使用用例，虽然文件放在 policy 目录下，导航归属 API Gateway。 */
const SECTION_OVERRIDES: Record<string, string> = {
  "/docs/policy/ip-access": "gateway",
  "/docs/gateway/traffic-policy": "policy",
}

/** 标题过于通用（多个板块重名）的页面，在 <title> 里补上所属板块以区分。 */
const GENERIC_TITLES = new Set(["概览", "概述", "快速开始"])

export function sectionOf(url: string): Section | null {
  const key = SECTION_OVERRIDES[url] ?? url.split("/")[2]
  return key ? (SECTIONS[key] ?? null) : null
}

export function seoTitleOf(title: string, url: string): string {
  const section = sectionOf(url)
  return section && GENERIC_TITLES.has(title) ? `${title} - ${section.label}` : title
}

function filePathOf(pagePath: string) {
  return path.join(CONTENT_DIR, pagePath)
}

/** 页面仍然是「空文档占位」时不应被索引；写入真实内容后会自动恢复。 */
export function isPlaceholderPage(pagePath: string): boolean {
  try {
    return readFileSync(filePathOf(pagePath), "utf8").includes("<DocsPlaceholder")
  } catch {
    return false
  }
}

/** 文件真实修改时间；读取失败时返回 undefined，宁可不写也不写假时间。 */
export function lastModifiedOf(pagePath: string): Date | undefined {
  try {
    return statSync(filePathOf(pagePath)).mtime
  } catch {
    return undefined
  }
}

export function breadcrumbOf(title: string, url: string) {
  const section = sectionOf(url)
  const items = [{ name: "文档", url: `${SITE_URL}/docs` }]
  if (section && `${SITE_URL}${section.href}` !== `${SITE_URL}${url}`) {
    items.push({ name: section.label, url: `${SITE_URL}${section.href}` })
  }
  items.push({ name: title, url: `${SITE_URL}${url}` })
  return items
}
