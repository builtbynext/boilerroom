import type { Metadata } from "next"

import "./globals.css"
import { Agentation } from "agentation"
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
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  )
}
