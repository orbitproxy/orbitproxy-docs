import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"
import type { ComponentPropsWithoutRef } from "react"

import { Alert, Callout } from "@/components/alert"
import { Diagram } from "@/components/diagram"

function heading(Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6") {
  return function DocsHeading(props: ComponentPropsWithoutRef<typeof Tag>) {
    return <Tag {...props} />
  }
}

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    h1: heading("h1"),
    h2: heading("h2"),
    h3: heading("h3"),
    h4: heading("h4"),
    h5: heading("h5"),
    h6: heading("h6"),
    Alert,
    Callout,
    Diagram,
    ...components,
  } satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents
