import { createRelativeLink } from "fumadocs-ui/mdx"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { CopyPage } from "@/components/copy-page"
import { getMDXComponents } from "@/components/mdx"
import { source } from "@/lib/source"

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  const MDX = page.data.body
  const toc = page.data.toc ?? []

  return (
    <div className="docs-main-inner">
      <article className="docs-article">
        <header className="mb-6">
          <div className="docs-title-row">
            <h1 className="docs-title">{page.data.title}</h1>
            <CopyPage />
          </div>
          {page.data.description ? (
            <p className="docs-desc">{page.data.description}</p>
          ) : null}
        </header>
        <div className="prose">
          <MDX
            components={getMDXComponents({
              a: createRelativeLink(source, page),
            })}
          />
        </div>
      </article>
      {toc.length > 0 ? (
        <nav className="docs-toc" aria-label="Table of contents">
          {toc.map((item) => (
            <a key={item.url} href={item.url} data-depth={item.depth}>
              {item.title}
            </a>
          ))}
        </nav>
      ) : null}
    </div>
  )
}

export function generateStaticParams() {
  return source.generateParams()
}

export async function generateMetadata(
  props: PageProps<"/docs/[[...slug]]">,
): Promise<Metadata> {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  return {
    title: page.data.title,
    description: page.data.description,
  }
}
