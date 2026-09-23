"use client"

import { BookOpen } from "lucide-react"
import { useSearchContext } from "fumadocs-ui/contexts/search"

export function AskDocs() {
  const { setOpenSearch } = useSearchContext()

  return (
    <button type="button" className="ask-docs" onClick={() => setOpenSearch(true)}>
      <BookOpen className="size-3.5" />
      Ask Docs
    </button>
  )
}
