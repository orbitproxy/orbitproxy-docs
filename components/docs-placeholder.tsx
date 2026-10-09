"use client"

import { QRCodeSVG } from "qrcode.react"

/* 与 orbitproxy-website/components/contact-modal.tsx 保持一致 */
const CONTACT_QR_URL = "https://work.weixin.qq.com/kfid/kfcbf9e2142defa76b1"
const LOGO_SRC = "/logo.svg"
const LOGO_ASPECT = 368.28 / 108
const QR_SIZE = 160

type DocsPlaceholderProps = {
  /** 提示文案，默认是「制作组正在加急编撰中」 */
  message?: string
}

export function DocsPlaceholder({
  message = "内容制作组正在加急编撰中，如需咨询相关能力，可扫码联系客服。",
}: DocsPlaceholderProps) {
  const logoWidth = Math.round(QR_SIZE * 0.4)
  const logoHeight = Math.round(logoWidth / LOGO_ASPECT)

  return (
    <div className="docs-placeholder">
      <p className="docs-placeholder-text">{message}</p>
      <div className="docs-placeholder-qr">
        <QRCodeSVG
          value={CONTACT_QR_URL}
          size={QR_SIZE}
          level="H"
          bgColor="#ffffff"
          fgColor="#111111"
          title="客服二维码"
          imageSettings={{
            src: LOGO_SRC,
            height: logoHeight,
            width: logoWidth,
            excavate: true,
          }}
          className="block"
        />
      </div>
    </div>
  )
}
