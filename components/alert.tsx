import type { ReactNode } from "react"

const ICONS = {
  info: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-6h2v6Zm0-8h-2V7h2v2Z" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M1 21h22L12 2 1 21Zm12-3h-2v-2h2v2Zm0-4h-2v-4h2v4Z" />
    </svg>
  ),
  error: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm1 15h-2v-2h2v2Zm0-4h-2V7h2v6Z" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm-1.2 14.4-3.6-3.6 1.4-1.4 2.2 2.2 5-5 1.4 1.4-6.4 6.4Z" />
    </svg>
  ),
} as const

export type AlertType = keyof typeof ICONS

type AlertProps = {
  type?: AlertType
  showIcon?: boolean
  children: ReactNode
}

export function Alert({ type = "info", showIcon = true, children }: AlertProps) {
  return (
    <div className="docs-alert" data-type={type} role="status">
      {showIcon ? <span className="docs-alert-icon">{ICONS[type]}</span> : null}
      <div className="docs-alert-body">{children}</div>
    </div>
  )
}

export function Callout({
  type,
  children,
}: {
  type?: string
  children: ReactNode
}) {
  const mapped: AlertType =
    type === "warn" || type === "warning"
      ? "warning"
      : type === "error"
        ? "error"
        : type === "success"
          ? "success"
          : "info"
  return <Alert type={mapped}>{children}</Alert>
}
