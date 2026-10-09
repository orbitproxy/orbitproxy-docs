import { createRelativeLink } from "fumadocs-ui/mdx"
import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { CopyPage } from "@/components/copy-page"
import { DocsJsonLd } from "@/components/docs-json-ld"
import { getMDXComponents } from "@/components/mdx"
import {
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_TITLE,
  isPlaceholderPage,
  lastModifiedOf,
  seoDescriptionOf,
  seoTitleOf,
} from "@/lib/seo"
import { source } from "@/lib/source"

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page) notFound()

  const MDX = page.data.body
  const toc = params.slug?.length ? (page.data.toc ?? []) : []

  return (
    <div className="docs-main-inner">
      {isPlaceholderPage(page.path) ? null : (
        <DocsJsonLd
          title={page.data.title}
          description={seoDescriptionOf(page.url, page.data.description)}
          url={page.url}
          modified={lastModifiedOf(page.path)}
        />
      )}
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

  const isHome = !params.slug?.length
  const title = isHome ? SITE_TITLE : seoTitleOf(page.data.title, page.url)
  const description = isHome ? SITE_DESCRIPTION : seoDescriptionOf(page.url, page.data.description)

  return {
    title: isHome ? { absolute: SITE_TITLE } : title,
    description,
    alternates: { canonical: page.url },
    robots: isPlaceholderPage(page.path) ? { index: false, follow: true } : undefined,
    openGraph: {
      type: isHome ? "website" : "article",
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      url: page.url,
      title,
      description,
      images: [SITE_OG_IMAGE],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [SITE_OG_IMAGE],
    },
  }
}
