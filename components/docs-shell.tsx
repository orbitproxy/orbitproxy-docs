"use client"

import { useEffect, useState, type ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Folder, Node, Root } from "fumadocs-core/page-tree"
import { useSearchContext } from "fumadocs-ui/contexts/search"

const PRIMARY_NAV = [
  {
    href: "/docs",
    label: "快速入门",
    match: (pathname: string) =>
      pathname === "/docs" ||
      pathname.startsWith("/docs/start") ||
      (pathname.startsWith("/docs/gateway") && !isTrafficPolicyPath(pathname)),
    select: (tree: Root) => {
      const nodes: Node[] = []
      const gateways: Node[] = []
      for (const node of tree.children) {
        if (node.type === "page" && node.url === "/docs") nodes.push(node)
        if (node.type === "folder" && folderCovers(node, "/docs/gateway")) {
          for (const child of node.children) {
            if (child.type === "page" && isTrafficPolicyPath(child.url)) continue
            gateways.push(child)
          }
        }
      }
      if (gateways.length > 0) {
        nodes.push({ type: "separator", name: "概念入门" })
        nodes.push(...gateways)
      }
      return nodes
    },
  },
  {
    href: "/docs/cases/api/localhost-api",
    label: "用户使用场景",
    match: (pathname: string) => pathname.startsWith("/docs/cases"),
    select: (tree: Root) => flattenPages(folderChildren(tree, "/docs/cases")),
  },
  {
    href: "/docs/observe/access-logs",
    label: "可观测性",
    match: (pathname: string) => pathname.startsWith("/docs/observe"),
    select: (tree: Root) => folderChildren(tree, "/docs/observe"),
  },
  {
    href: "/docs/policy",
    label: "流量策略",
    match: (pathname: string) => isTrafficPolicyPath(pathname),
    select: (tree: Root) => folderWithIndex(tree, "/docs/policy"),
  },
  {
    href: "/docs/client/cli",
    label: "orbitproxy 客户端",
    match: (pathname: string) => pathname.startsWith("/docs/client"),
    select: (tree: Root) => folderChildren(tree, "/docs/client"),
  },
  {
    href: "/docs/integrate/sdk",
    label: "集成 orbitproxy",
    match: (pathname: string) => pathname.startsWith("/docs/integrate"),
    select: (tree: Root) => folderChildren(tree, "/docs/integrate"),
  },
  {
    href: "/docs/deploy/overview",
    label: "私有化部署",
    match: (pathname: string) => pathname.startsWith("/docs/deploy"),
    select: (tree: Root) => folderChildren(tree, "/docs/deploy"),
  },
] as const

function isTrafficPolicyPath(pathname: string) {
  return (
    pathname === "/docs/policy" ||
    pathname.startsWith("/docs/policy/") ||
    pathname === "/docs/gateway/traffic" ||
    pathname.startsWith("/docs/gateway/traffic/")
  )
}

function folderCovers(folder: Folder, prefix: string): boolean {
  if (folder.index?.url.startsWith(prefix)) return true
  return folder.children.some((child) => {
    if (child.type === "page") return child.url.startsWith(prefix)
    if (child.type === "folder") return folderCovers(child, prefix)
    return false
  })
}

function folderChildren(tree: Root, prefix: string): Node[] {
  const folder = tree.children.find(
    (node): node is Folder => node.type === "folder" && folderCovers(node, prefix),
  )
  return folder?.children ?? []
}

function flattenPages(nodes: Node[]): Node[] {
  const pages: Node[] = []
  for (const node of nodes) {
    if (node.type === "page") pages.push(node)
    if (node.type === "folder") pages.push(...flattenPages(folderChildNodes(node)))
  }
  return pages
}

function folderWithIndex(tree: Root, prefix: string): Node[] {
  const folder = tree.children.find(
    (node): node is Folder => node.type === "folder" && folderCovers(node, prefix),
  )
  if (!folder) return []
  return folder.index ? [folder.index, ...folder.children] : folder.children
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
          <Link href="/docs" className="docs-logo" aria-label="OrbitProxy Docs Home">
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
            <a href="http://localhost:3000" className="docs-btn docs-btn-primary">
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
        <aside className="docs-sidebar" aria-label="二级导航">
          <div className="docs-sidebar-tree">
            <NavTree nodes={secondary} pathname={pathname} />
          </div>
        </aside>
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
