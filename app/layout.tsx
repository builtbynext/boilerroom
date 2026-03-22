import type { Metadata } from "next"

import "./globals.css"
import { SiteShell } from "@/components/site/site-shell"
import { getLatestChangelogEntry } from "@/lib/content"

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
  const latestChangelogPromise = getLatestChangelogEntry()

  return (
    <html lang="en">
      <body>
        <SiteShell latestChangelogPromise={latestChangelogPromise}>
          {children}
        </SiteShell>
      </body>
    </html>
  )
}
