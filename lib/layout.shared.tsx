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
      { text: "快速入门", url: "/docs" },
      { text: "用户使用场景", url: "/docs/cases/api/localhost-api" },
      { text: "可观测性", url: "/docs/observe/access-logs" },
      { text: "流量策略", url: "/docs/policy" },
      { text: "orbitproxy 客户端", url: "/docs/client/cli" },
      { text: "集成 orbitproxy", url: "/docs/integrate/sdk" },
      { text: "私有化部署", url: "/docs/deploy/overview" },
      {
        type: "custom",
        secondary: true,
        children: <NavActions />,
      },
    ],
  }
}
