import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "MAFO - 지도 내비게이션 앱",
  description: "카카오맵 기반 내비게이션 서비스",
  generator: "v0.dev",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: "cover",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body suppressHydrationWarning={true}>{children}</body>
    </html>
  )
}
