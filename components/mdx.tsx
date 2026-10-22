import defaultMdxComponents from "fumadocs-ui/mdx"
import type { MDXComponents } from "mdx/types"

import { Alert, Callout } from "@/components/alert"
import { ChangelogList } from "@/components/changelog-list"
import { Diagram } from "@/components/diagram"
import { DocsCodeTabs, DocsPre } from "@/components/docs-code-group"
import { DocsPlaceholder } from "@/components/docs-placeholder"
import { DocsTable } from "@/components/docs-table"
import { VideoGallery } from "@/components/video-gallery"
import { PolicyTag } from "@/components/policy-tag"
import { QrLink } from "@/components/qr-link"

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    pre: DocsPre,
    DocsCodeTabs,
    Alert,
    Callout,
    ChangelogList,
    Diagram,
    DocsTable,
    DocsPlaceholder,
    PolicyTag,
    VideoGallery,
    QrLink,
    ...components,
  } satisfies MDXComponents
}

export const useMDXComponents = getMDXComponents
