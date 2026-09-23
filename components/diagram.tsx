"use client"

import { useEffect, useState } from "react"

type DiagramProps = {
  src: string
  alt: string
}

export function Diagram({ src, alt }: DiagramProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", onKey)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <>
      <button
        type="button"
        className="docs-diagram-trigger"
        onClick={() => setOpen(true)}
        aria-label={`放大查看${alt}`}
      >
        <img className="docs-diagram" src={src} alt={alt} />
      </button>
      {open ? (
        <div
          className="docs-diagram-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setOpen(false)}
        >
          <img src={src} alt={alt} />
        </div>
      ) : null}
    </>
  )
}
