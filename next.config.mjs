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
      { source: "/", destination: "/docs", permanent: true },
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
