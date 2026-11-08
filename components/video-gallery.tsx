"use client"

import { useState } from "react"

export type DocsVideo = {
  slug: string
  title: string
  summary: string
  coverUrl: string
  playUrl: string
  category: { name: string; slug: string }
}

export type DocsVideoCategory = {
  name: string
  slug: string
}

export function VideoGallery({
  videos,
  categories,
}: {
  videos: DocsVideo[]
  categories: DocsVideoCategory[]
}) {
  const [active, setActive] = useState("all")
  const visible = videos.filter((video) => active === "all" || video.category.slug === active)
  const filters = [{ slug: "all", name: "全部" }, ...categories]

  return (
    <div className="video-gallery">
      <div className="video-filters" role="tablist" aria-label="视频分类">
        {filters.map((filter) => (
          <button
            key={filter.slug}
            type="button"
            role="tab"
            aria-selected={active === filter.slug}
            data-active={active === filter.slug}
            className="video-filter"
            onClick={() => setActive(filter.slug)}
          >
            {filter.name}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="docs-release-empty">还没有已发布的视频。</p>
      ) : (
        <div className="video-row">
          {visible.map((video) => (
            <div key={video.slug} className="video-col">
              <a className="video-card" href={video.playUrl} target="_blank" rel="noopener noreferrer">
                <img className="video-card-img" src={video.coverUrl} alt="" />
                <div className="video-card-content">
                  <h4 className="video-card-title">
                    <span className={`video-card-tag ${categoryTone(video.category)}`}>{video.category.name}</span>
                    {video.title}
                  </h4>
                  <p className="video-card-desc">{video.summary}</p>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function categoryTone(category: { name: string; slug: string }) {
  const key = `${category.slug} ${category.name}`.toLowerCase()
  if (key.includes("mcp")) return "bg-purple-500/20 text-purple-700"
  if (key.includes("api")) return "bg-green-500/20 text-green-700"
  return "bg-blue-500/20 text-blue-700"
}
