"use client"

import { useState } from "react"

import { PolicyTag, type PolicyScope } from "@/components/policy-tag"

type Video = {
  title: string
  href: string
  scope: PolicyScope
  description?: string
}

const FILTERS: { key: "all" | PolicyScope; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "api", label: "API网关" },
  { key: "mcp", label: "MCP网关" },
]

/**
 * 官方视频列表。与 orbitproxy-console 安装指引保持一致：卡片只展示标题和 bilibili 外链，
 * 不嵌入播放器，也不带封面和预览。通用视频在每个分类下都会出现。
 */
export function VideoGallery({ videos }: { videos: Video[] }) {
  const [active, setActive] = useState<"all" | PolicyScope>("all")
  const visible = videos.filter(
    (video) => active === "all" || video.scope === "common" || video.scope === active,
  )

  return (
    <div className="video-gallery">
      <div className="video-filters" role="tablist" aria-label="视频分类">
        {FILTERS.map((filter) => (
          <button
            key={filter.key}
            type="button"
            role="tab"
            aria-selected={active === filter.key}
            className="video-filter"
            data-active={active === filter.key}
            onClick={() => setActive(filter.key)}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="video-grid">
        {visible.map((video) => (
          <a
            key={video.href}
            className="video-card"
            href={video.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            <PolicyTag scope={video.scope} inline />
            <span className="video-card-title">{video.title}</span>
            {video.description ? (
              <span className="video-card-desc">{video.description}</span>
            ) : null}
            <span className="video-card-source">
              <img src="/install/bilibili.png" alt="" width={20} height={20} />
              前往bilibili观看官方教程
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}
