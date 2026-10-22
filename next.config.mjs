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
}

export default withMDX(config)
