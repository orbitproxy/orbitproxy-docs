import type { ReactNode } from "react"

type DocsTableProps = {
  children: ReactNode
}

export function DocsTable({ children }: DocsTableProps) {
  return (
    <div
      role="presentation"
      data-component-part="scroll-area"
      data-table-wrapper="true"
      className="docs-data-table min-w-0 [--page-padding:20px] flex w-[calc(100%+(var(--page-padding)*2))] my-[1em] py-[1em] -mx-(--page-padding) max-w-none [contain:inline-size] [&_table]:m-0 [&_table]:min-w-full [&_table]:w-full [&_table]:max-w-none [&_table]:table [&_th]:text-left [&_td[data-numeric]]:tabular-nums [&_td]:min-w-[150px]"
      style={{ position: "relative" }}
    >
      <div
        role="region"
        tabIndex={-1}
        className="size-full rounded-[inherit] [--scroll-area-fade-size:32px] overflow-x-auto overflow-y-hidden"
        data-component-part="scroll-area-viewport"
        aria-label="Scrollable table"
      >
        <div
          role="presentation"
          data-component-part="scroll-area-content"
          className="flex"
          style={{ minWidth: "fit-content" }}
        >
          <div className="px-(--page-padding) grow max-w-none table">{children}</div>
        </div>
      </div>
    </div>
  )
}
