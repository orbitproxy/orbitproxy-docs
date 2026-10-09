"use client"

import { useEffect, useState, type ReactNode } from "react"
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

const PRIMARY_NAV: NavItem[] = [
  {
    href: "/docs",
    label: "概览",
    match: (pathname) => pathname === "/docs" || pathname === "/docs/start/how-it-works",
    select: () => [],
  },
  {
    href: "/docs/gateway/overview",
    label: "API Gateway",
    match: (pathname) =>
      (covers(pathname, "/docs/gateway") && pathname !== "/docs/gateway/traffic-policy") ||
      pathname === "/docs/policy/ip-access",
    select: (tree) => [
      ...group(tree, "入门指引", [
        "/docs/gateway/overview",
        "/docs/gateway/quickstart",
        "/docs/gateway/endpoints",
      ]),
      ...group(tree, "使用用例", [
        "/docs/gateway/use-cases/traffic-entry",
        "/docs/gateway/use-cases/wechat-webhook",
        "/docs/policy/ip-access",
        "/docs/gateway/use-cases/maintenance-mode",
        "/docs/gateway/use-cases/block-bots",
        "/docs/gateway/use-cases/compress-json",
      ]),
    ],
  },
  {
    href: "/docs/mcp-gateway/overview",
    label: "MCP Gateway",
    match: (pathname) => covers(pathname, "/docs/mcp-gateway"),
    select: (tree) => [
      ...group(tree, "入门指引", [
        "/docs/mcp-gateway/overview",
        "/docs/mcp-gateway/quickstart",
        "/docs/mcp-gateway/connector",
        "/docs/mcp-gateway/composer",
      ]),
      ...group(tree, "用例", [
        "/docs/mcp-gateway/use-cases/connect-internal",
        "/docs/mcp-gateway/use-cases/composer",
      ]),
      ...namedGroup(tree, "概念", [
        ["MCP可观测性", "/docs/mcp-gateway/observability"],
      ]),
    ],
  },
  {
    href: "/docs/gateway/traffic-policy",
    label: "流量策略",
    match: (pathname) =>
      pathname === "/docs/gateway/traffic-policy" ||
      (covers(pathname, "/docs/policy") && pathname !== "/docs/policy/ip-access"),
    select: (tree) =>
      pages(tree, [
        "/docs/gateway/traffic-policy",
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
    href: "/docs/client/cli",
    label: "客户端",
    match: (pathname) => covers(pathname, "/docs/client"),
    select: (tree) => pages(tree, ["/docs/client/cli"]),
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
              href="http://localhost:3000"
              className="docs-btn docs-btn-primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              进入控制中心
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
        {node.name}
      </Link>
    )
  })
}
