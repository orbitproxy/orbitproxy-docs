import { VideoGallery, type DocsVideo, type DocsVideoCategory } from "@/components/video-gallery"

const CONTROL_PLANE_URL = (
  process.env.CONTROL_PLANE_URL ??
  process.env.NEXT_PUBLIC_CONTROL_PLANE_URL ??
  "https://cp.app.orbitproxy.cloud"
).replace(/\/$/, "")

const REVALIDATE_SECONDS = 60

type WebsitePayload<T> = { data?: { items?: T[] | null } }

async function loadVideos(): Promise<{ videos: DocsVideo[]; categories: DocsVideoCategory[] }> {
  try {
    const [videosResponse, categoriesResponse] = await Promise.all([
      fetch(`${CONTROL_PLANE_URL}/v1/website/videos`, { next: { revalidate: REVALIDATE_SECONDS } }),
      fetch(`${CONTROL_PLANE_URL}/v1/website/videos/categories`, { next: { revalidate: REVALIDATE_SECONDS } }),
    ])
    if (!videosResponse.ok || !categoriesResponse.ok) {
      return { videos: [], categories: [] }
    }
    const videosPayload = (await videosResponse.json()) as WebsitePayload<DocsVideo>
    const categoriesPayload = (await categoriesResponse.json()) as WebsitePayload<DocsVideoCategory>
    return {
      videos: videosPayload.data?.items ?? [],
      categories: categoriesPayload.data?.items ?? [],
    }
  } catch {
    return { videos: [], categories: [] }
  }
}

export async function DocsVideos() {
  const { videos, categories } = await loadVideos()
  return <VideoGallery videos={videos} categories={categories} />
}
