import localFont from "next/font/local"
import type { ReactNode } from "react"
import { RootProvider } from "fumadocs-ui/provider/next"

import "./global.css"

const mmEuclid = localFont({
  src: [
    {
      path: "../public/fonts/MMEuclidLatin-400.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/MMEuclidLatin-500.woff2",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-mm-euclid",
  display: "swap",
})

export const metadata = {
  title: {
    default: "OrbitProxy Docs",
    template: "%s · OrbitProxy Docs",
  },
  description: "OrbitProxy 产品文档与接入指南。",
  icons: {
    icon: [{ url: "/logo-mark.svg", type: "image/svg+xml" }],
  },
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="zh-CN"
      className={`${mmEuclid.variable} ${mmEuclid.className}`}
      suppressHydrationWarning
    >
      <body>
        <RootProvider
          theme={{
            defaultTheme: "light",
            enabled: false,
            enableSystem: false,
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  )
}
