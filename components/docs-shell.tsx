"use client"

import { useEffect, useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Folder, Node, Root } from "fumadocs-core/page-tree"
import { useSearchContext } from "fumadocs-ui/contexts/search"

import { PolicyTag, type PolicyScope } from "@/components/policy-tag"

type NavItem = {
  href: string
  label: string
  match: (pathname: string) => boolean
  select: (tree: Root) => Node[]
}

/** 控制中心地址，构建时由 NEXT_PUBLIC_CONSOLE_URL 注入。 */
const CONSOLE_URL =
  process.env.NEXT_PUBLIC_CONSOLE_URL ?? "https://dashboard.app.orbitproxy.cloud"

const USE_CASE_PAGES = [
  "/docs/gateway/use-cases/traffic-entry",
  "/docs/gateway/use-cases/wechat-webhook",
  "/docs/policy/ip-access",
  "/docs/gateway/use-cases/maintenance-mode",
  "/docs/gateway/use-cases/block-bots",
  "/docs/gateway/use-cases/compress-json",
  "/docs/mcp-gateway/use-cases/connect-internal",
  "/docs/mcp-gateway/use-cases/composer",
]

/** 使用用例在侧边栏标题前显示的适用范围，与各页正文第一行的 PolicyTag 保持一致。 */
const USE_CASE_SCOPES: Record<string, PolicyScope> = {
  "/docs/gateway/use-cases/traffic-entry": "api",
  "/docs/gateway/use-cases/wechat-webhook": "api",
  "/docs/policy/ip-access": "api",
  "/docs/gateway/use-cases/maintenance-mode": "api",
  "/docs/gateway/use-cases/block-bots": "api",
  "/docs/gateway/use-cases/compress-json": "api",
  "/docs/mcp-gateway/use-cases/connect-internal": "mcp",
  "/docs/mcp-gateway/use-cases/composer": "mcp",
}

/** 核心概念：各个板块的概述页。页面 URL 不变，只是在侧边栏里归到「快速开始」。 */
const CORE_CONCEPTS: [string, string][] = [
  ["API网关", "/docs/gateway/overview"],
  ["MCP网关", "/docs/mcp-gateway/overview"],
  ["客户端", "/docs/client/overview"],
  ["云端点", "/docs/gateway/endpoints"],
  ["内部端点", "/docs/start/internal-endpoint"],
  ["MCP 连接器", "/docs/mcp-gateway/connector"],
  ["MCP Composer", "/docs/mcp-gateway/composer"],
  ["流量策略", "/docs/gateway/traffic-policy"],
  ["可观测性", "/docs/gateway/observability"],
  ["MCP可观测性", "/docs/mcp-gateway/observability"],
]

const CORE_CONCEPT_URLS = CORE_CONCEPTS.map(([, url]) => url)

const PRIMARY_NAV: NavItem[] = [
  {
    href: "/docs",
    label: "快速开始",
    match: (pathname) =>
      pathname === "/docs" ||
      covers(pathname, "/docs/start") ||
      CORE_CONCEPT_URLS.includes(pathname),
    select: (tree) => [
      ...group(tree, "入门", [
        "/docs",
        "/docs/start/quickstart",
        "/docs/start/how-it-works",
        "/docs/start/videos",
        "/docs/start/changelog",
        "/docs/start/contact",
      ]),
      ...namedGroup(tree, "核心概念", CORE_CONCEPTS),
    ],
  },
  {
    href: USE_CASE_PAGES[0],
    label: "orbitproxy使用用例",
    match: (pathname) => USE_CASE_PAGES.includes(pathname),
    select: (tree) => group(tree, "使用用例", USE_CASE_PAGES),
  },
  {
    href: "/docs/client/cli",
    label: "客户端",
    match: (pathname) =>
      covers(pathname, "/docs/client") && !CORE_CONCEPT_URLS.includes(pathname),
    select: (tree) =>
      namedPages(tree, [
        ["安装指引", "/docs/client/install"],
        ["orbitproxy cli", "/docs/client/cli"],
        ["客户端工作原理", "/docs/client/how-it-works"],
        ["了解 .orbitproxy 目录", "/docs/client/orbitproxy-directory"],
        ["客户端架构安全性", "/docs/client/security"],
        ["升级客户端版本", "/docs/client/upgrade"],
      ]),
  },
  {
    href: "/docs/policy/ip-access-control",
    label: "流量策略",
    match: (pathname) =>
      covers(pathname, "/docs/policy") && pathname !== "/docs/policy/ip-access",
    select: (tree) =>
      pages(tree, [
        "/docs/policy/ip-access-control",
        "/docs/policy/basic-auth",
        "/docs/policy/api-key",
        "/docs/policy/http-header",
        "/docs/policy/custom-response",
        "/docs/policy/access-log",
        "/docs/policy/webhook-verify",
        "/docs/policy/mcp-access",
      ]),
  },
  {
    href: "/docs/legal/overview",
    label: "法律和合规",
    match: (pathname) => covers(pathname, "/docs/legal"),
    select: (tree) => [
      ...group(tree, "法律和合规", ["/docs/legal/overview"]),
      ...group(tree, "协议和政策", ["/docs/legal/terms", "/docs/legal/privacy"]),
    ],
  },
  {
    href: "/docs/faq",
    label: "常见问题",
    match: (pathname) => covers(pathname, "/docs/faq"),
    select: (tree) => pages(tree, ["/docs/faq"]),
  },
]

function findPageName(nodes: Node[], url: string): ReactNode {
  for (const node of nodes) {
    if (node.type === "page" && node.url === url) return node.name
    if (node.type === "folder") {
      if (node.index?.url === url) return node.index.name
      const found = findPageName(node.children, url)
      if (found) return found
    }
  }
  return null
}

function covers(pathname: string, prefix: string) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`)
}

function indexPages(nodes: Node[], into = new Map<string, Extract<Node, { type: "page" }>>()) {
  for (const node of nodes) {
    if (node.type === "page") into.set(node.url, node)
    if (node.type === "folder") {
      if (node.index) into.set(node.index.url, node.index)
      indexPages(node.children, into)
    }
  }
  return into
}

function pages(tree: Root, urls: string[]): Node[] {
  const indexed = indexPages(tree.children)
  return urls.flatMap((url) => {
    const page = indexed.get(url)
    return page ? [page] : []
  })
}

function namedPages(tree: Root, items: [string, string][]): Node[] {
  const indexed = indexPages(tree.children)
  return items.flatMap(([label, url]) => {
    const page = indexed.get(url)
    return page ? [{ ...page, name: label }] : []
  })
}

function group(tree: Root, name: string, urls: string[]): Node[] {
  const items = pages(tree, urls)
  if (items.length === 0) return []
  return [{ type: "separator", name }, ...items]
}

function namedGroup(tree: Root, name: string, items: [string, string][]): Node[] {
  const indexed = indexPages(tree.children)
  const nodes = items.flatMap(([label, url]) => {
    const page = indexed.get(url)
    return page ? [{ ...page, name: label }] : []
  })
  if (nodes.length === 0) return []
  return [{ type: "separator", name }, ...nodes]
}

export function DocsShell({
  tree,
  children,
}: {
  tree: Root
  children: ReactNode
}) {
  const pathname = usePathname()
  const { setOpenSearch } = useSearchContext()
  const primary = PRIMARY_NAV.find((item) => item.match(pathname)) ?? PRIMARY_NAV[0]
  const secondary = primary.select(tree)
  const [menuOpen, setMenuOpen] = useState(false)
  const currentTitle = findPageName(secondary, pathname)

  // 路由切换后收起移动端菜单
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // 菜单展开时锁住页面滚动
  useEffect(() => {
    if (!menuOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [menuOpen])

  return (
    <>
      <header className="docs-header">
        <div className="docs-header-inner">
        <div className="docs-header-bar">
          <Link href="/docs" className="docs-logo" aria-label="orbitproxy docs home">
            <Image
              src="/logo.svg"
              alt="orbitproxy"
              width={120}
              height={24}
              priority
              style={{ width: "auto", height: 24 }}
            />
            <span className="docs-logo-rule" aria-hidden />
            <span className="docs-logo-word">文档</span>
          </Link>
          <div className="docs-header-actions">
            <a
              href="https://orbitproxy.cc"
              className="docs-btn docs-btn-ghost"
              target="_blank"
              rel="noopener noreferrer"
            >
              官网
            </a>
            <a
              href={CONSOLE_URL}
              className="docs-btn docs-btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              进入控制中心
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="docs-btn-chevron"
              >
                <path d="M6.5 2.75L12.75 9L6.5 15.25" />
              </svg>
            </a>
          </div>
        </div>
        <nav className="docs-header-nav" aria-label="一级导航">
          <ul>
            {PRIMARY_NAV.map((link) => (
              <li key={link.href}>
                <Link href={link.href} data-active={link.match(pathname)}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        </div>
      </header>

      {secondary.length > 0 ? (
        <div className="docs-mobile-bar">
          <button
            type="button"
            className="docs-mobile-trigger"
            aria-expanded={menuOpen}
            aria-controls="docs-mobile-menu"
            onClick={() => setMenuOpen((value) => !value)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {menuOpen ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
            <span className="docs-mobile-crumb">
              <span>{primary.label}</span>
              {currentTitle ? (
                <>
                  <span className="docs-mobile-crumb-sep" aria-hidden>
                    /
                  </span>
                  <span className="docs-mobile-crumb-current">{currentTitle}</span>
                </>
              ) : null}
            </span>
          </button>
          {menuOpen ? (
            <nav id="docs-mobile-menu" className="docs-mobile-menu" aria-label="二级导航">
              <NavTree nodes={secondary} pathname={pathname} />
            </nav>
          ) : null}
        </div>
      ) : null}

      <div className="docs-frame">
        {secondary.length > 0 ? (
          <aside className="docs-sidebar" aria-label="二级导航">
            <div className="docs-sidebar-tree">
              <NavTree nodes={secondary} pathname={pathname} />
            </div>
          </aside>
        ) : null}
        <div className="docs-main">{children}</div>
      </div>

      <button type="button" className="docs-ask" onClick={() => setOpenSearch(true)}>
        Ask Docs
      </button>
    </>
  )
}

function folderContainsPath(folder: Folder, pathname: string): boolean {
  if (folder.index?.url === pathname) return true
  return folder.children.some((child) => {
    if (child.type === "page") return child.url === pathname
    if (child.type === "folder") return folderContainsPath(child, pathname)
    return false
  })
}

function folderChildNodes(folder: Folder): Node[] {
  if (!folder.index) return folder.children
  const already = folder.children.some(
    (child) => child.type === "page" && child.url === folder.index?.url,
  )
  return already ? folder.children : [folder.index, ...folder.children]
}

function NavFolder({ folder, pathname }: { folder: Folder; pathname: string }) {
  const childActive = folderContainsPath(folder, pathname)
  const [open, setOpen] = useState(() => childActive || folder.defaultOpen === true)

  useEffect(() => {
    if (childActive) setOpen(true)
  }, [childActive])

  return (
    <div className="docs-nav-group">
      <button
        type="button"
        className="docs-nav-folder"
        data-open={open}
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        <span className="docs-nav-folder-label">{folder.name}</span>
        <span className="docs-nav-folder-chevron" aria-hidden />
      </button>
      {open ? (
        <div className="docs-nav-children">
          <NavTree nodes={folderChildNodes(folder)} pathname={pathname} />
        </div>
      ) : null}
    </div>
  )
}

function NavTree({
  nodes,
  pathname,
}: {
  nodes: Node[]
  pathname: string
}) {
  return nodes.map((node) => {
    if (node.type === "separator") {
      return (
        <div key={String(node.name)} className="docs-nav-label">
          {node.name}
        </div>
      )
    }
    if (node.type === "folder") {
      if (folderChildNodes(node).length === 0) return null
      return <NavFolder key={String(node.name)} folder={node} pathname={pathname} />
    }
    return (
      <Link
        key={node.url}
        href={node.url}
        className="docs-nav-link"
        data-selected={pathname === node.url}
      >
        {USE_CASE_SCOPES[node.url] ? (
          <span className="docs-nav-tag">
            <PolicyTag scope={USE_CASE_SCOPES[node.url]} inline />
          </span>
        ) : null}
        {node.name}
      </Link>
    )
  })
}
