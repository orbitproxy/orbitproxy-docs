"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Folder, Node, Root } from "fumadocs-core/page-tree"
import { useSearchContext } from "fumadocs-ui/contexts/search"

type NavItem = {
  href: string
  label: string
  match: (pathname: string) => boolean
  select: (tree: Root) => Node[]
}

/** 控制中心地址，构建时由 NEXT_PUBLIC_CONSOLE_URL 注入。 */
const CONSOLE_URL =
  process.env.NEXT_PUBLIC_CONSOLE_URL ?? "https://dashboard.app.orbitproxy.cloud"

const API_USE_CASES = [
  "/docs/gateway/use-cases/traffic-entry",
  "/docs/gateway/use-cases/wechat-webhook",
  "/docs/policy/ip-access",
  "/docs/gateway/use-cases/maintenance-mode",
  "/docs/gateway/use-cases/block-bots",
  "/docs/gateway/use-cases/compress-json",
]

const MCP_USE_CASES = [
  "/docs/mcp-gateway/use-cases/connect-internal",
  "/docs/mcp-gateway/use-cases/composer",
]

const USE_CASE_PAGES = [...API_USE_CASES, ...MCP_USE_CASES]

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
    select: (tree) => [
      ...group(tree, "API网关用例", API_USE_CASES),
      ...group(tree, "MCP网关用例", MCP_USE_CASES),
    ],
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

const DocsMetaContext = createContext<{ section: string; group: string | null }>({
  section: "",
  group: null,
})

export function DocsCrumb() {
  const { section, group } = useContext(DocsMetaContext)
  if (!section) return null
  return (
    <div className="docs-crumb">
      <span>{section}</span>
      {group ? (
        <>
          <svg viewBox="0 0 12 12" width="12" height="12" fill="none" aria-hidden="true">
            <path
              d="M4.5 2.5 8 6l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{group}</span>
        </>
      ) : null}
    </div>
  )
}

function crumbGroup(nodes: Node[], pathname: string): string | null {
  let label: string | null = null
  for (const node of nodes) {
    if (node.type === "separator") {
      label = String(node.name)
      continue
    }
    if (node.type === "page" && node.url === pathname) return label
    if (node.type === "folder" && folderContainsPath(node, pathname)) {
      return label ?? String(node.name)
    }
  }
  return null
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
  const rawPath = usePathname()
  // next.config 把 / 改写到 /docs，地址栏仍是 /。选中态按文档首页算。
  const pathname = rawPath === "/" ? "/docs" : rawPath
  const { setOpenSearch } = useSearchContext()
  const primary = PRIMARY_NAV.find((item) => item.match(pathname)) ?? PRIMARY_NAV[0]
  const secondary = primary.select(tree)
  const [menuOpen, setMenuOpen] = useState(false)
  const [drawerSectionHref, setDrawerSectionHref] = useState<string | null>(primary.href)
  const [modKey, setModKey] = useState("⌘")
  const group = crumbGroup(secondary, pathname)

  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) setModKey("Ctrl")
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  useEffect(() => {
    if (menuOpen) setDrawerSectionHref(primary.href)
  }, [menuOpen, primary.href])

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
    <DocsMetaContext.Provider value={{ section: primary.label, group }}>
      <header className="docs-header">
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
        <nav className="docs-header-nav" aria-label="一级导航">
          <ul>
            {PRIMARY_NAV.map((link) => (
              <li key={link.href}>
                <Link href={link.href} data-active={link.match(pathname) ? "true" : "false"}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="docs-header-actions">
          {secondary.length > 0 ? (
            <button
              type="button"
              className="docs-menu-btn"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "关闭目录" : "打开目录"}
              onClick={() => setMenuOpen((value) => !value)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                {menuOpen ? (
                  <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                ) : (
                  <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                )}
              </svg>
            </button>
          ) : null}
          <a
            href="https://orbitproxy.cc"
            className="docs-btn docs-btn-secondary"
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
          </a>
        </div>
      </header>

      {menuOpen ? (
        <div className="docs-drawer-root">
          <button type="button" className="docs-drawer-backdrop" aria-label="关闭目录" onClick={() => setMenuOpen(false)} />
          <aside className="docs-drawer" aria-label="文档目录">
            <div className="docs-drawer-bar">
              <button type="button" className="docs-drawer-icon" aria-label="关闭目录" onClick={() => setMenuOpen(false)}>
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M3.5 3.5l9 9M12.5 3.5l-9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
              <button
                type="button"
                className="docs-drawer-icon"
                aria-label="搜索"
                onClick={() => {
                  setMenuOpen(false)
                  setOpenSearch(true)
                }}
              >
                <svg width="20" height="20" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10.5 10.5 13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            {drawerSectionHref ? (
              <>
                <div className="docs-drawer-drill">
                  <button type="button" className="docs-drawer-back" onClick={() => setDrawerSectionHref(null)}>
                    <span className="docs-drawer-back-icon" aria-hidden />
                    <span className="docs-drawer-back-label">
                      {PRIMARY_NAV.find((item) => item.href === drawerSectionHref)?.label}
                    </span>
                    <span className="docs-drawer-back-spacer" aria-hidden />
                    <span className="docs-sr">，返回全部栏目</span>
                  </button>
                </div>
                <div className="docs-drawer-scroll">
                  <div className="docs-sidebar-tree">
                    <NavTree
                      nodes={(PRIMARY_NAV.find((item) => item.href === drawerSectionHref) ?? primary).select(tree)}
                      pathname={pathname}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="docs-drawer-scroll">
                <div className="docs-drawer-sections" role="navigation" aria-label="一级导航">
                  {PRIMARY_NAV.map((item) => (
                    <button
                      key={item.href}
                      type="button"
                      className="docs-nav-link"
                      data-selected={item.match(pathname) ? "true" : "false"}
                      onClick={() => setDrawerSectionHref(item.href)}
                    >
                      <span className="docs-nav-text">{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="docs-drawer-foot">
              <a href="https://orbitproxy.cc" target="_blank" rel="noopener noreferrer">
                官网
              </a>
              <a href={CONSOLE_URL} target="_blank" rel="noopener noreferrer">
                进入控制中心
              </a>
            </div>
          </aside>
        </div>
      ) : null}

      <div className="docs-frame">
        {secondary.length > 0 ? (
          <aside className="docs-sidebar" data-open={menuOpen ? "true" : "false"} aria-label="二级导航">
            <div className="docs-sidebar-search">
              <button type="button" className="docs-search" onClick={() => setOpenSearch(true)}>
                <svg className="docs-search-icon" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="7" cy="7" r="4.25" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M10.5 10.5 13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span className="docs-search-label">搜索</span>
                <span className="docs-search-keys">
                  <kbd>{modKey}</kbd>
                  <kbd>K</kbd>
                </span>
              </button>
            </div>
            <div className="docs-sidebar-scroll">
              <div className="docs-sidebar-tree">
                <NavTree nodes={secondary} pathname={pathname} />
              </div>
            </div>
          </aside>
        ) : null}
        <div className="docs-main">{children}</div>
      </div>

      <button type="button" className="docs-ask" onClick={() => setOpenSearch(true)}>
        Ask Docs
      </button>
    </DocsMetaContext.Provider>
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
  const groups: { key: string; label: ReactNode | null; items: Node[] }[] = []
  let bucket: { key: string; label: ReactNode | null; items: Node[] } = {
    key: "start",
    label: null,
    items: [],
  }
  nodes.forEach((node, index) => {
    if (node.type === "separator") {
      if (bucket.label || bucket.items.length > 0) groups.push(bucket)
      bucket = { key: `sep-${index}-${String(node.name)}`, label: node.name, items: [] }
      return
    }
    bucket.items.push(node)
  })
  if (bucket.label || bucket.items.length > 0) groups.push(bucket)

  return groups.map((group) => (
    <div key={group.key} className="docs-nav-group">
      {group.label ? <div className="docs-nav-label">{group.label}</div> : null}
      {group.items.map((node) => {
        if (node.type === "folder") {
          if (folderChildNodes(node).length === 0) return null
          return <NavFolder key={String(node.name)} folder={node} pathname={pathname} />
        }
        if (node.type !== "page") return null
        return (
          <Link
            key={node.url}
            href={node.url}
            className="docs-nav-link"
            data-selected={pathname === node.url ? "true" : "false"}
          >
            <span className="docs-nav-text">{node.name}</span>
          </Link>
        )
      })}
    </div>
  ))
}
