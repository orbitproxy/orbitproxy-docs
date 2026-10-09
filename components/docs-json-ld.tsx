import { SITE_NAME, SITE_URL, breadcrumbOf } from "@/lib/seo"

type DocsJsonLdProps = {
  title: string
  description?: string
  url: string
  modified?: Date
}

/** 防止内容里出现 `</script>` 之类的片段提前闭合标签。 */
function serialize(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c")
}

export function DocsJsonLd({ title, description, url, modified }: DocsJsonLdProps) {
  const pageUrl = `${SITE_URL}${url}`

  const article = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: title,
    ...(description ? { description } : {}),
    url: pageUrl,
    inLanguage: "zh-CN",
    mainEntityOfPage: pageUrl,
    ...(modified ? { dateModified: modified.toISOString() } : {}),
    publisher: { "@type": "Organization", name: "orbitproxy", url: SITE_URL },
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
  }

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbOf(title, url).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(article) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serialize(breadcrumb) }} />
    </>
  )
}
