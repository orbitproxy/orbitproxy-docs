import type { Metadata } from "next"
import localFont from "next/font/local"
import type { ReactNode } from "react"
import { RootProvider } from "fumadocs-ui/provider/next"

import {
  SITE_DESCRIPTION,
  SITE_LOCALE,
  SITE_NAME,
  SITE_OG_IMAGE,
  SITE_TITLE,
  SITE_URL,
} from "@/lib/seo"

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

const alata = localFont({
  src: "../public/fonts/Alata-Regular.ttf",
  variable: "--font-alata",
  weight: "400",
  style: "normal",
  display: "swap",
})

const geistMono = localFont({
  src: "../public/fonts/GeistMono-Variable.woff2",
  variable: "--font-geist-mono",
  display: "swap",
  weight: "100 900",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  verification: {
    other: {
      "baidu-site-verification": "codeva-iwCUoQHQGW",
    },
  },
  icons: {
    icon: [{ url: "/logo-mark.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: SITE_LOCALE,
    url: "/docs",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
  twitter: {
    card: "summary",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [SITE_OG_IMAGE],
  },
}

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="zh-CN"
      className={`${mmEuclid.variable} ${alata.variable} ${geistMono.variable}`}
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
