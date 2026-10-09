import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"
import {
  cloneElement,
  createElement,
  isValidElement,
  type ComponentPropsWithoutRef,
  type ReactNode,
} from "react"

import { Alert, Callout } from "@/components/alert"
import { Diagram } from "@/components/diagram"
import { DocsCodeTabs, DocsPre } from "@/components/docs-code-group"
import { DocsPlaceholder } from "@/components/docs-placeholder"
import { DocsTable } from "@/components/docs-table"

function wrapOrbitproxy(node: ReactNode): ReactNode {
  if (typeof node === "string") {
    const parts = node.split(/(orbitproxy)/gi)
    if (parts.length === 1) return node
    return parts.map((part, index) =>
      part.toLowerCase() === "orbitproxy" ? (
        <span key={index} className="docs-wordmark">
          {part}
        </span>
      ) : (
        part
      ),
    )
  }
  if (Array.isArray(node)) return node.map((child) => wrapOrbitproxy(child))
  if (!isValidElement<{ children?: ReactNode }>(node)) return node
  if (node.type === "code" || node.type === "pre") return node
  return cloneElement(node, undefined, wrapOrbitproxy(node.props.children))
}

function text<Tag extends "p" | "li" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6">(
  Tag: Tag,
) {
  return function DocsText({ children, ...props }: ComponentPropsWithoutRef<Tag>) {
    return createElement(Tag, props, wrapOrbitproxy(children))
  }
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    h1: text("h1"),
    h2: text("h2"),
    h3: text("h3"),
    h4: text("h4"),
    h5: text("h5"),
    h6: text("h6"),
    p: text("p"),
    li: text("li"),
    pre: DocsPre,
    DocsCodeTabs,
    Alert,
    Callout,
    Diagram,
    DocsTable,
    DocsPlaceholder,
    ...components,
  } satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents
