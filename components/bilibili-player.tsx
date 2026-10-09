const DEFAULT_SRC =
  "https://player.bilibili.com/player.html?isOutside=true&aid=117371591198673&bvid=BV17AaU67Euq&cid=42411887214&p=1&autoplay=0&danmaku=0&high_quality=1"

export function BilibiliPlayer({
  src = DEFAULT_SRC,
  title = "3 分钟了解AI时代的orbitproxy云网关",
  framed = false,
}: {
  src?: string
  title?: string
  framed?: boolean
}) {
  return (
    <div className={framed ? "docs-video docs-video-framed" : "docs-video"}>
      <iframe
        src={src}
        title={title}
        scrolling="no"
        allow="fullscreen; autoplay"
        allowFullScreen
      />
    </div>
  )
}
