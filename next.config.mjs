import { createMDX } from "fumadocs-mdx/next"

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
  output: "standalone",
  reactStrictMode: true,
  turbopack: {
    root: process.cwd(),
  },
  agentRules: false,
  // 根路径直接返回文档首页（200），不做跳转：百度站长平台验证不跟随重定向。
  // canonical 仍指向 /docs，避免重复收录。
  async rewrites() {
    return [{ source: "/", destination: "/docs" }]
  },
  async redirects() {
    return [
      { source: "/docs/ai/mcp", destination: "/docs/mcp-gateway/overview", permanent: true },
      { source: "/docs/gateway/api", destination: "/docs/gateway/overview", permanent: true },
      { source: "/docs/gateway/mcp", destination: "/docs/mcp-gateway/overview", permanent: true },
      { source: "/docs/gateway/mcp-quickstart", destination: "/docs/mcp-gateway/quickstart", permanent: true },
      { source: "/docs/gateway/mcp-connector", destination: "/docs/mcp-gateway/connector", permanent: true },
      { source: "/docs/gateway/mcp-composer", destination: "/docs/mcp-gateway/composer", permanent: true },
      { source: "/docs/gateway/mcp-traffic-policy", destination: "/docs/gateway/traffic-policy", permanent: true },
      { source: "/docs/mcp-gateway/traffic-policy", destination: "/docs/gateway/traffic-policy", permanent: true },
      { source: "/docs/gateway/mcp-observability", destination: "/docs/mcp-gateway/observability", permanent: true },
      { source: "/docs/gateway/mcp-use-cases/:slug", destination: "/docs/mcp-gateway/use-cases/:slug", permanent: true },
      { source: "/docs/reference/cli", destination: "/docs/client/cli", permanent: true },
      { source: "/docs/gateway/traffic", destination: "/docs/policy", permanent: true },
    ]
  },
}

export default withMDX(config)
