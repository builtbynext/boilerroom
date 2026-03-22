import type { Metadata } from "next"

import "./globals.css"
import { SiteShell } from "@/components/site/site-shell"

export const metadata: Metadata = {
  title: {
    default: "Boiler Room",
    template: "%s | Boiler Room",
  },
  description:
    "A personal publishing site for writing, books, and notes, built with Next.js and Sveltia CMS.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
