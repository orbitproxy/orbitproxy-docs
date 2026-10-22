"use client"

import { useEffect, useId, useState, type ReactNode } from "react"
import { createPortal } from "react-dom"
import { QRCodeSVG } from "qrcode.react"

/* 与 orbitproxy-website/components/contact-modal.tsx 保持一致 */
const CONTACT_QR_URL = "https://work.weixin.qq.com/kfid/kfcbf9e2142defa76b1"
const LOGO_SRC = "/logo.svg"
const LOGO_ASPECT = 368.28 / 108
const QR_SIZE = 220

type QrLinkProps = {
  /** 触发文字，例如「查看客服二维码」 */
  children: ReactNode
  /** 弹窗标题 */
  title: string
  /** 弹窗里二维码下面的提示 */
  hint?: string
  /** 不传时展示企业微信官方客服二维码；传了就展示这张图片 */
  image?: string
}

export function QrLink({ children, title, hint, image }: QrLinkProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const titleId = useId()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!open) return

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    document.addEventListener("keydown", onKey)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  const logoWidth = Math.round(QR_SIZE * 0.4)
  const logoHeight = Math.round(logoWidth / LOGO_ASPECT)

  return (
    <>
      <button
        type="button"
        className="docs-qr-trigger"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
      >
        {children}
      </button>
      {open && mounted
        ? createPortal(
            <div className="docs-qr-overlay" onClick={() => setOpen(false)}>
              <div
                className="docs-qr-dialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
                onClick={(event) => event.stopPropagation()}
              >
                <button
                  type="button"
                  className="docs-qr-close"
                  onClick={() => setOpen(false)}
                  aria-label="关闭"
                >
                  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
                    <path
                      d="M3 3l10 10M13 3L3 13"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </button>
                <div id={titleId} className="docs-qr-title">
                  {title}
                </div>
                {hint ? <div className="docs-qr-hint">{hint}</div> : null}
                <div className="docs-qr-code">
                  {image ? (
                    <img src={image} alt={`${title}二维码`} />
                  ) : (
                    <QRCodeSVG
                      value={CONTACT_QR_URL}
                      size={QR_SIZE}
                      level="H"
                      bgColor="#ffffff"
                      fgColor="#111111"
                      title={`${title}二维码`}
                      imageSettings={{
                        src: LOGO_SRC,
                        height: logoHeight,
                        width: logoWidth,
                        excavate: true,
                      }}
                      className="block"
                    />
                  )}
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
