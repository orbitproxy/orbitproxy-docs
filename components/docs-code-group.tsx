"use client"

import {
  Children,
  createContext,
  isValidElement,
  useContext,
  useState,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react"

const InCodeGroup = createContext(false)

export function useInCodeGroup() {
  return useContext(InCodeGroup)
}

function CopyIcon() {
  return (
    <svg viewBox="0 0 256 256" width={16} height={16} fill="currentColor" aria-hidden>
      <path d="M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 256 256" width={16} height={16} fill="currentColor" aria-hidden>
      <path d="M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z" />
    </svg>
  )
}

function CopyButton() {
  const [copied, setCopied] = useState(false)

  return (
    <button
      type="button"
      className="docs-code-copy"
      aria-label={copied ? "已复制" : "复制代码"}
      onClick={(event) => {
        const pre = event.currentTarget.closest(".docs-code-group")?.querySelector("pre")
        const text = pre?.textContent?.replace(/\n$/, "") ?? ""
        void navigator.clipboard.writeText(text).then(() => {
          setCopied(true)
          window.setTimeout(() => setCopied(false), 1200)
        })
      }}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </button>
  )
}

function WindowDots() {
  return (
    <div className="docs-code-dots" aria-hidden="true">
      <span className="docs-code-dot" data-tone="danger" />
      <span className="docs-code-dot" data-tone="warning" />
      <span className="docs-code-dot" data-tone="success" />
    </div>
  )
}

export function DocsCodeTabs({
  tabs,
  children,
}: {
  tabs: { label: string; icon?: string }[]
  children: ReactNode
}) {
  const panels = Children.toArray(children).filter(isValidElement)
  const [active, setActive] = useState(0)

  return (
    <InCodeGroup.Provider value={true}>
      <div className="docs-code-group">
        <div className="docs-code-chrome">
          <WindowDots />
          <div className="docs-code-group-tabs" role="tablist">
            {tabs.map((tab, index) => (
              <button
                key={tab.label}
                type="button"
                role="tab"
                className="docs-code-group-tab"
                data-active={index === active}
                aria-selected={index === active}
                onClick={() => setActive(index)}
              >
                <span className="docs-code-group-tab-label">{tab.label}</span>
                {index === active ? <span className="docs-code-group-tab-mark" /> : null}
              </button>
            ))}
          </div>
          <CopyButton />
        </div>
        <div className="docs-code-group-panel">{panels[active]}</div>
      </div>
    </InCodeGroup.Provider>
  )
}

const SHELL_LANGS = new Set([
  "bash",
  "sh",
  "shell",
  "shellscript",
  "zsh",
  "bat",
  "cmd",
  "powershell",
])

function codeTitle(props: { title?: string; className?: string; "data-language"?: string }) {
  if (props.title) return props.title
  const lang = props["data-language"] || props.className?.match(/language-([\w-]+)/)?.[1] || ""
  if (!lang || SHELL_LANGS.has(lang)) return "terminal"
  return lang
}

export function DocsPre(
  props: ComponentPropsWithoutRef<"pre"> & {
    title?: string
    "data-language"?: string
  },
) {
  const grouped = useInCodeGroup()
  const [copied, setCopied] = useState(false)
  const title = codeTitle(props)

  if (grouped) {
    return <pre {...props} className="docs-code-pre" />
  }

  return (
    <div className="docs-code-group">
      <div className="docs-code-chrome">
        <WindowDots />
        <div className="docs-code-group-tabs">
          <span className="docs-code-group-tab" data-active="true">
            <span className="docs-code-group-tab-label">{title}</span>
            <span className="docs-code-group-tab-mark" />
          </span>
        </div>
        <button
          type="button"
          className="docs-code-copy"
          aria-label={copied ? "已复制" : "复制代码"}
          onClick={(event) => {
            const pre = event.currentTarget.closest(".docs-code-group")?.querySelector("pre")
            void navigator.clipboard.writeText(pre?.textContent?.replace(/\n$/, "") ?? "").then(() => {
              setCopied(true)
              window.setTimeout(() => setCopied(false), 1200)
            })
          }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
      </div>
      <div className="docs-code-group-panel">
        <pre {...props} className="docs-code-pre" />
      </div>
    </div>
  )
}
