"use client"

import { CaretDown } from "@phosphor-icons/react/dist/ssr"
import { useState } from "react"
import ReactMarkdown from "react-markdown"
import rehypeSanitize from "rehype-sanitize"
import remarkGfm from "remark-gfm"

/* 与 orbitproxy-console/components/install/release-notes.tsx 保持一致 */
export type ReleaseNote = {
  id: string
  title: string
  releasedOn: string
  contentMd: string
}

function formatReleasedOn(value: string) {
  const [year, month, day] = value.split("-")
  if (!year || !month || !day) {
    return value
  }
  return `${Number(year)}年${Number(month)}月${Number(day)}日`
}

export function ReleaseNotes({ entries }: { entries: ReleaseNote[] }) {
  const [openId, setOpenId] = useState<string | null>(null)

  return (
    <section className="docs-release-notes" aria-label="更新日志">
      {entries.map((entry) => {
        const open = openId === entry.id
        return (
          <div key={entry.id} className="docs-release-item">
            <button
              type="button"
              aria-expanded={open}
              className="docs-release-trigger"
              onClick={() => setOpenId(open ? null : entry.id)}
            >
              <span className="docs-release-date">{formatReleasedOn(entry.releasedOn)}</span>
              <span className="docs-release-title">{entry.title}</span>
              <CaretDown className="docs-release-caret" data-open={open} size={16} />
            </button>
            {open ? (
              <div className="docs-release-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                  {entry.contentMd}
                </ReactMarkdown>
              </div>
            ) : null}
          </div>
        )
      })}
    </section>
  )
}
