/**
 * 流量策略适用范围标识。样式取自 orbitproxy-console `components/ui/tag.tsx`：
 * `rounded px-1.5 py-0.5 text-xs font-medium` + `bg-{tone}-500/20 text-{tone}-700`。
 * 色调沿用 console：通用 = default(blue)，API 网关 = success(green)，MCP 网关 = purple。
 */
const SCOPES = {
  common: { label: "通用", className: "bg-blue-500/20 text-blue-700" },
  api: { label: "API网关", className: "bg-green-500/20 text-green-700" },
  mcp: { label: "MCP网关", className: "bg-purple-500/20 text-purple-700" },
} as const

export type PolicyScope = keyof typeof SCOPES

export function PolicyTag({ scope, inline = false }: { scope: PolicyScope; inline?: boolean }) {
  const { label, className } = SCOPES[scope]
  const tag = (
    <span
      className={`inline-flex w-fit cursor-default items-center whitespace-nowrap rounded px-1.5 py-0.5 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  )
  if (inline) {
    return tag
  }
  return <div className="not-prose my-3">{tag}</div>
}
