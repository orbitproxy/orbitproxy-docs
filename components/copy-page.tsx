"use client"

import { useState } from "react"

export function CopyPage() {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    const article = document.querySelector("article")
    const text = article?.innerText?.trim()
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <button type="button" className="docs-btn docs-btn-secondary" onClick={onCopy}>
      {copied ? "Copied" : "Copy page"}
    </button>
  )
}
