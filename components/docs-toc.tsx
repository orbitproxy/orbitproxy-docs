"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

type TocItem = {
  url: string
  title: ReactNode
  depth: number
}

export function DocsToc({ items }: { items: TocItem[] }) {
  const listRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(items[0]?.url ?? "")
  const [bar, setBar] = useState({ top: 0, height: 0 })

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.url.replace(/^#/, "")))
      .filter((node): node is HTMLElement => node !== null)
    if (headings.length === 0) return

    const sync = () => {
      const line = 56 + 32
      let current = headings[0]
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= line) current = heading
      }
      setActive(`#${current.id}`)
    }

    sync()
    window.addEventListener("scroll", sync, { passive: true })
    return () => window.removeEventListener("scroll", sync)
  }, [items])

  useEffect(() => {
    const list = listRef.current
    const link = list?.querySelector<HTMLAnchorElement>(`a[href="${CSS.escape(active)}"]`)
    if (!list || !link) return
    setBar({ top: link.offsetTop, height: link.offsetHeight })
  }, [active, items])

  if (items.length === 0) return null

  return (
    <div className="docs-toc-wrap">
      <nav className="docs-toc" aria-label="Table of contents">
        <div className="docs-toc-list" ref={listRef}>
          <div className="docs-toc-bar" style={{ top: bar.top, height: bar.height }} />
          {items.map((item) => (
            <a key={item.url} href={item.url} data-active={item.url === active ? "true" : "false"}>
              {item.title}
            </a>
          ))}
        </div>
      </nav>
    </div>
  )
}
