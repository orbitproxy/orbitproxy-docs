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
  async redirects() {
    return [
      { source: "/docs/ai/mcp", destination: "/docs/gateway/mcp", permanent: true },
      { source: "/docs/cases/local-expose", destination: "/docs/cases/api/localhost-api", permanent: true },
      { source: "/docs/cases/api/local-expose", destination: "/docs/cases/api/localhost-api", permanent: true },
      { source: "/docs/cases/localhost/localhost-api", destination: "/docs/cases/api/localhost-api", permanent: true },
      { source: "/docs/cases/localhost/wechat-webhook", destination: "/docs/cases/api/wechat-webhook", permanent: true },
      { source: "/docs/cases/webhook/localhost-pay", destination: "/docs/cases/api/wechat-webhook", permanent: true },
      { source: "/docs/cases/api/access-control", destination: "/docs/cases/api/localhost-api", permanent: true },
      { source: "/docs/cases/api/maintenance", destination: "/docs/cases/api/localhost-api", permanent: true },
      { source: "/docs/cases/api/qps", destination: "/docs/cases/api/localhost-api", permanent: true },
      { source: "/docs/cases/api/cors", destination: "/docs/cases/api/localhost-api", permanent: true },
      { source: "/docs/cases/agent-ops", destination: "/docs/cases/mcp/agent-ops", permanent: true },
      { source: "/docs/gateway/logs", destination: "/docs/observe/access-logs", permanent: true },
      { source: "/docs/reference/cli", destination: "/docs/client/cli", permanent: true },
      { source: "/docs/start/sdk", destination: "/docs/integrate/sdk", permanent: true },
      { source: "/docs/reference/http", destination: "/docs/integrate/http", permanent: true },
      { source: "/docs/gateway/traffic", destination: "/docs/policy", permanent: true },
    ]
  },
}

export default withMDX(config)
