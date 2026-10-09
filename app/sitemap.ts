import type { MetadataRoute } from "next"

import { SITE_URL, isPlaceholderPage, lastModifiedOf } from "@/lib/seo"
import { source } from "@/lib/source"

export default function sitemap(): MetadataRoute.Sitemap {
  return source
    .getPages()
    .filter((page) => !isPlaceholderPage(page.path))
    .map((page) => ({
      url: `${SITE_URL}${page.url}`,
      lastModified: lastModifiedOf(page.path),
      changeFrequency: page.url === "/docs" ? "weekly" : "monthly",
      priority: page.url === "/docs" ? 1 : 0.6,
    }))
}
