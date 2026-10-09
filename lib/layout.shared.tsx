import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared"

import { BrandLogo } from "@/components/brand-logo"
import { NavActions } from "@/components/nav-actions"

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: <BrandLogo />,
      url: "/docs",
      transparentMode: "none",
    },
    links: [
      { text: "概览", url: "/docs" },
      { text: "API Gateway", url: "/docs/gateway/overview" },
      { text: "MCP Gateway", url: "/docs/mcp-gateway/overview" },
      { text: "客户端", url: "/docs/client/cli" },
      {
        type: "custom",
        secondary: true,
        children: <NavActions />,
      },
    ],
  }
}
