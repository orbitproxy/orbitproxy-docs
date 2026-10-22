import { ReleaseNotes, type ReleaseNote } from "@/components/release-notes"

/* 与控制中心同源：公开的 /v1/product-changelog */
const CONTROL_PLANE_URL = (
  process.env.CONTROL_PLANE_URL ??
  process.env.NEXT_PUBLIC_CONTROL_PLANE_URL ??
  "https://cp.app.orbitproxy.cloud"
).replace(/\/$/, "")

type ChangelogPayload = {
  id: string
  title?: string
  releasedOn: string
  contentMd?: string
}

async function loadReleaseNotes(): Promise<ReleaseNote[]> {
  try {
    const response = await fetch(`${CONTROL_PLANE_URL}/v1/product-changelog`, {
      next: { revalidate: 300 },
    })
    if (!response.ok) return []
    const payload = (await response.json()) as { data?: ChangelogPayload[] }
    return (payload.data ?? [])
      .filter((entry) => entry.contentMd)
      .map((entry) => ({
        id: entry.id,
        title: entry.title ?? "",
        releasedOn: entry.releasedOn,
        contentMd: entry.contentMd ?? "",
      }))
  } catch {
    return []
  }
}

export async function ChangelogList() {
  const entries = await loadReleaseNotes()

  if (entries.length === 0) {
    return <p className="docs-release-empty">还没有发布记录。</p>
  }

  return <ReleaseNotes entries={entries} />
}
